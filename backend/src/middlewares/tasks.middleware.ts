import { NextFunction, Request, Response } from "express"
import { AuthService } from "../controllers/auth.controller"

const authService = new AuthService()
const accessRoles: string[] = ["admin", "manager"]

export const TasksAccess = (req: Request, res: Response, next: NextFunction): any => {
    const token: string | null | any = authService.extractToken(req)
    const { role }: any =  authService.verifyToken(token)
    if (!role) {
        return res.status(403).json({ warning: "Access Denied" })
    }
    if (accessRoles.includes(role)) {
        return next()
    }
    res.status(403).json({ warning: "Access Denied" })
}