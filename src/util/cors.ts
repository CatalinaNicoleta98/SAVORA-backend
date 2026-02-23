

import { Application } from 'express';
import cors from 'cors';

export function setupCors(app: Application): void {
    // Comma-separated list of allowed origins, for example:
    const corsOrigins = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);

    // If CORS_ORIGINS is not set, fall back to local dev defaults
    const allowedOrigins = corsOrigins.length
        ? corsOrigins
        : ['http://localhost:5173', 'http://localhost:5174'];

    app.use(
        cors({
            origin: allowedOrigins,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: [
                'x-auth-token',
                'x-access-token',
                'auth-token',
                'Authorization',
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
            ],
            credentials: true,
        })
    );

    app.options(/.*/, cors());
}