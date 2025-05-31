import { NextFunction, Request, Response } from "express";
import { AuthService } from "../controllers/auth.controller";

const authService = new AuthService()

export const AdminAccess = (req: Request, res: Response, next: NextFunction) => {
    const token = authService.extractToken(req, res)
    const { role }: any = authService.verifyToken(token)

    if (role === "admin") {
        return next()
    }
    res.status(403).json({ error: "Access Denied" })
}