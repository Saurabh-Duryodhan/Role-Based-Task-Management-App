import { Request, Response, Router } from "express";
import { AuthService } from "../controllers/auth.controller";

const authRouter = Router();
const authService = new AuthService()

authRouter.post("/register", async (req: Request, res: Response): Promise<any> => authService.register(req, res));
authRouter.post("/login", async (req: Request, res: Response): Promise<any> => authService.login(req, res))

export { authRouter }