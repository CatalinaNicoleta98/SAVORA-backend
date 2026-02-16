import {Router, Request, Response} from 'express';
import {createRecipe,
    getAllRecipes, 
    getRecipeById,
    deleteRecipeById,
    updateRecipeById
} from './controllers/recipeController';
import {registerUser, loginUser, verifyToken} from './controllers/authController';

const router: Router = Router();

//get, post, put, delete (CRUD)


router.get('/', (req: Request, res: Response) => {

    res.status(200).send('Welcome to SAVORA');
});

//auth routes
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
//CRUD routes
//create
router.post('/recipes', verifyToken, createRecipe);
//read
router .get('/recipes', getAllRecipes);
router.get('/recipes/:id', getRecipeById);
//update
router.put('/recipes/:id',verifyToken, updateRecipeById);
//delete
router.delete('/recipes/:id',verifyToken, deleteRecipeById);

export default router;