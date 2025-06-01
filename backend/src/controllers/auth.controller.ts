import { Request, Response } from "express"
import { Users } from "../models/users.model"
import type { IUser } from "../models/users.model"
import * as jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { getConfigEnv } from "../database/connection"

export interface JWT_PAYLOAD {
    _id: string,
    email: string,
    role: string
}

export class AuthService {
    constructor() { console.log("Auth Service Initiated!") }

    JWT_SECRET_KEY = getConfigEnv('JWT_ACCESS_SECRET')
    JWT_SECRET_REFRESH_KEY = getConfigEnv("JWT_REFRESH_SECRET")

    // User registration
    register = async (req: Request, res: Response): Promise<IUser | Error | Response> => {
        try {
            const existed = await this.checkExistedUser(req.body.email)
            if (existed) {
                return res.status(409).json({ message: "User already exists" })
            }
            const hashedPassword = await this.hashPassword(req.body.password)
            const onBoardedUser = await Users.create({ ...req.body, password: hashedPassword })
            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    _id: onBoardedUser._id,
                    email: onBoardedUser.email,
                    role: onBoardedUser.role
                }
            })
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: "Internal server error during registration" })
        }
    }

    // User Login
    login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" })
            }

            const user = await this.checkExistedUser(email)
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" })
            }

            const comparePassword = await bcrypt.compare(password, user.password)
            if (!comparePassword) {
                return res.status(401).json({ message: "Invalid credentials" })
            }

            const tokens = await this.generateTokens(user)
            await Users.findByIdAndUpdate(
                user._id.toString(),
                { $set: { refreshToken: tokens.refresh_token } }
            )

            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            })

            return res.status(200).json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role
                },
                tokens: {
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token
                }
            })
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: "Internal server error during login" })
        }
    }

    // Logout
    logout = async (req: Request, res: Response): Promise<Response> => {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                return res.status(204).end()
            }

            // Clear refresh token from database
            await Users.findOneAndUpdate(
                { refreshToken },
                { $set: { refreshToken: null } }
            )

            // Clear refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            })

            return res.status(200).json({ message: "Logged out successfully" })
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ message: "Internal server error during logout" })
        }
    }

    // Refresh token
    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh token not found" })
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, this.JWT_SECRET_REFRESH_KEY) as JWT_PAYLOAD

            // Check if refresh token exists in database
            const user = await Users.findOne({
                _id: decoded._id,
                refreshToken: refreshToken
            })

            if (!user) {
                return res.status(401).json({ message: "Invalid refresh token" })
            }

            // Generate new tokens
            const tokens = await this.generateTokens(user)
            await Users.findByIdAndUpdate(
                user._id.toString(),
                { $set: { refreshToken: tokens.refresh_token } }
            )

            // Set new refresh token cookie
            res.cookie('refreshToken', tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            })

            return res.status(200).json({
                message: "Token refreshed successfully",
                access_token: tokens.access_token
            })
        } catch (error) {
            console.error('Refresh token error:', error);
            return res.status(401).json({ message: "Invalid refresh token" })
        }
    }

    // Helper functions
    checkExistedUser = async (email: string): Promise<IUser | null> => {
        return await Users.findOne({ email: email })
    }

    hashPassword = async (password: string): Promise<string> => {
        try {
            return await bcrypt.hash(password, 10)
        } catch (error) {
            console.error('Password hashing error:', error);
            throw new Error("Error while hashing password")
        }
    }

    generateTokens = async (user: IUser) => {
        try {
            const payload: JWT_PAYLOAD = {
                _id: user._id.toString(),
                email: user.email,
                role: user.role
            }

            const [access_token, refresh_token] = await Promise.all([
                jwt.sign(payload, this.JWT_SECRET_KEY, { expiresIn: "15m" }),
                jwt.sign(payload, this.JWT_SECRET_REFRESH_KEY, { expiresIn: "30d" })
            ])

            return { access_token, refresh_token }
        } catch (error) {
            console.error('Token generation error:', error);
            throw new Error("Error while generating tokens")
        }
    }

    extractToken = (req: Request): string | null => {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null
        }
        return authHeader.split(' ')[1]
    }

    verifyToken = async (token: string): Promise<JWT_PAYLOAD> => {
        try {
            return jwt.verify(token, this.JWT_SECRET_KEY) as JWT_PAYLOAD
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error("Token expired")
            }
            throw new Error("Invalid token")
        }
    }
} 