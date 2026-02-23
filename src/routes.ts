import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    deleteRecipeById,
    updateRecipeById,
} from './controllers/recipeController';
import { registerUser, loginUser, verifyToken, getMe, updateMe, deleteMe } from './controllers/authController';

const router: Router = Router();

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

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

//get, post, put, delete (CRUD)

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to SAVORA');
});

//auth routes

router.post('/user/register', registerUser);

router.post('/user/login', loginUser);

router.get('/user/me', verifyToken, getMe);

router.patch('/user/me', verifyToken, upload.single('profileImage'), updateMe);

router.delete('/user/me', verifyToken, deleteMe);

//CRUD routes
//create

router.post('/recipes', verifyToken, upload.single('image'), createRecipe);

//read

router.get('/recipes', getAllRecipes);

router.get('/recipes/:id', getRecipeById);

//update

router.put('/recipes/:id', verifyToken, upload.single('image'), updateRecipeById);

//delete

router.delete('/recipes/:id', verifyToken, deleteRecipeById);

export default router;