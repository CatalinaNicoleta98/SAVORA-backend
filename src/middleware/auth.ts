import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// middleware to verify the token and protect routes
export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).json({ error: 'Access denied, no token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as {
            id: string;
            email?: string;
            username?: string;
            iat?: number;
            exp?: number;
        };

        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.userUsername = decoded.username;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
