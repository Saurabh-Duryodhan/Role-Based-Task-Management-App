import { Request, Response, Router } from "express";
import { AuthService } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const authRouter = Router();
const authService = new AuthService()

authRouter.post("/register", async (req: Request, res: Response): Promise<any> => authService.register(req, res));
authRouter.post("/login", async (req: Request, res: Response): Promise<any> => authService.login(req, res));
authRouter.post("/logout", verifyToken, async (req: Request, res: Response): Promise<any> => authService.logout(req, res));
authRouter.post("/refresh-token", async (req: Request, res: Response): Promise<any> => authService.refreshToken(req, res));

export { authRouter }