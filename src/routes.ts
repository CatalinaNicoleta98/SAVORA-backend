import {Router, Request, Response} from 'express';
import {createRecipe,
    getAllRecipes, 
    getRecipeById,
    deleteRecipeById,
    updateRecipeById
} from './controllers/recipeController';

const router: Router = Router();

//get, post, put, delete (CRUD)


router.get('/', (req: Request, res: Response) => {

    res.status(200).send('Welcome to SAVORA');
});

router.post('/recipes', createRecipe);
router .get('/recipes', getAllRecipes);
router.get('/recipes/:id', getRecipeById);
router.put('/recipes/:id', updateRecipeById);
router.delete('/recipes/:id', deleteRecipeById);

export default router;