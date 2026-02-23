import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) => {
        cb(null, uploadsDir);
    },
    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) => {
        const safeOriginal = file.originalname.replace(/\s+/g, '-');
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}-${safeOriginal}`);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});
