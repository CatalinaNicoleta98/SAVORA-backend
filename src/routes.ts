import { Router, Request, Response } from 'express';
import { upload } from './util/upload';
import {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    deleteRecipeById,
    updateRecipeById,
} from './controllers/recipeController';
import { registerUser, loginUser, getMe, updateMe, deleteMe } from './controllers/authController';
import { verifyToken } from './middleware/auth';

const router: Router = Router();

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