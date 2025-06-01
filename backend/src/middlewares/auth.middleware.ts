import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../controllers/auth.controller';
import jwt from 'jsonwebtoken';

const authService = new AuthService();

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = authService.extractToken(req);
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = await authService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
}; 