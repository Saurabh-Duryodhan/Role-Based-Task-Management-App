import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../controllers/auth.controller';

const authService = new AuthService();

export const UserAccess = (req: Request, res: Response, next: NextFunction): void => {
    const token = authService.extractToken(req)
    const { role }: any = authService.verifyToken(token)
    if (role === 'user') {
        return next();
    }
    res.status(403).json({ error: 'Access denied: User role required' });
};