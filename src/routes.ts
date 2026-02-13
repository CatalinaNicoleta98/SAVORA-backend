import {Router, Request, Response} from 'express';
import {createRecipe} from './controllers/recipeController';

const router: Router = Router();

//get, post, put, delete (CRUD)


router.get('/', (req: Request, res: Response) => {

    res.status(200).send('Welcome to SAVORA');
});

router.post('/recipes', createRecipe);

export default router;