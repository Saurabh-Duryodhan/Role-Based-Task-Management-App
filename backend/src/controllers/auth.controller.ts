import { Request, Response } from "express"
import { Users } from "../models/users.model"
import type { IUser } from "../models/users.model"
import * as jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { getConfigEnv } from "../database/connection"

export interface JWT_PAYLOAD {
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
                return res.status(302).send({ message: "User already found!" })
            }
            const hashedPassword = await this.hashPassword(req.body.password)
            const onBoardedUser = await Users.create({ ...req.body, password: hashedPassword })
            res.status(201).send(onBoardedUser)
            return onBoardedUser
        } catch (error) {
            console.log('error: ', error);
            throw new Error()
        }
    }

    // User Login
    login = async (req: Request, res: Response): Promise<String | Boolean | Response | any> => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).send({ warning: "Invalid credentials" })
        }

        const existed = await this.checkExistedUser(email)
        if (existed) {
            const comparePassword = await bcrypt.compare(password, existed.password)
            if (comparePassword) {
                const tokens = await this.generateTokens(existed)
                if (tokens.ref_token) {
                    await Users.findOneAndUpdate({ email: existed.email }, { $set: { refreshToken: tokens.ref_token } }, { new: true })
                }
                return res.status(201).json(tokens)
            }
        }

    }


    // Helper functions

    checkExistedUser = async (email: string): Promise<IUser | null> => {
        const existed = await Users.findOne({ email: email })
        return existed
    }

    hashPassword = async (password: string): Promise<String | Error> => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            return hashedPassword
        } catch (error) {
            console.log('error: ', error);
            throw new Error("Error while generating password")
        }
    }

    generateRefresh = async (payload: JWT_PAYLOAD): Promise<String> => {
        const refresh_token = await jwt.sign(payload, this.JWT_SECRET_REFRESH_KEY, {
            expiresIn: "30d"
        })
        return refresh_token
    }

    generateTokens = async (user: IUser) => {
        try {
            const payload: JWT_PAYLOAD = { email: user.email, role: user.role };
            const access_token = await jwt.sign(payload, this.JWT_SECRET_KEY, {
                expiresIn: "15m"
            })
            const refresh_token = this.generateRefresh(payload)
            const [acc_token, ref_token] = await Promise.all([access_token, refresh_token])
            return { acc_token, ref_token }
        } catch (error) {
            console.log('error: ', error);
            throw new Error("Error while generating tokens!")
        }
    }

    extractToken = (req: Request, res: Response) => {
        const { authorization } = req.headers;
        console.log('req.headers: ', req.headers);
        console.log('authorization: ', authorization);
        const token = authorization?.replace("authorization ", "").trim()
        console.log('token: ', token);
        return token
    }

    verifyToken = (token: any) => {
        const isVerified = jwt.verify(token, this.JWT_SECRET_KEY);
        return isVerified
    }

} 