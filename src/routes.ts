import {Router, Request, Response} from 'express';
import {createRecipe,
    getAllRecipes, 
    getRecipeById,
    deleteRecipeById,
    updateRecipeById
} from './controllers/recipeController';
import {registerUser} from './controllers/authController';

const router: Router = Router();

//get, post, put, delete (CRUD)


router.get('/', (req: Request, res: Response) => {

    res.status(200).send('Welcome to SAVORA');
});

//auth routes
router.post('/user/register', registerUser);

//CRUD routes
//create
router.post('/recipes', createRecipe);
//read
router .get('/recipes', getAllRecipes);
router.get('/recipes/:id', getRecipeById);
//update
router.put('/recipes/:id', updateRecipeById);
//delete
router.delete('/recipes/:id', deleteRecipeById);

export default router;