import { Router, Request, Response } from 'express';
import {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    deleteRecipeById,
    updateRecipeById,
} from './controllers/recipeController';
import { registerUser, loginUser, verifyToken, getMe } from './controllers/authController';

const router: Router = Router();

//get, post, put, delete (CRUD)

/**
 * @swagger
 * /:
 *  get:
 *   tags:
 *   - App Routes
 *   summary: Welcome to SAVORA
 *   description: This endpoint returns a welcome message to the SAVORA API.
 *   responses:
 *    200:
 *     description: A welcome message to the SAVORA API.
 */
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to SAVORA');
});

//auth routes
/**
 * @swagger
 * /user/register:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Register a new user
 *   description: Creates a new user account.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/User'
 *      example:
 *       username: "kate123"
 *       email: "kate@example.com"
 *       password: "secret123"
 *   responses:
 *    201:
 *     description: User registered successfully
 *    400:
 *     description: Validation error
 *    500:
 *     description: Server error
 */
router.post('/user/register', registerUser);

/**
 * @swagger
 * /user/login:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Login
 *   description: Logs a user in and returns a JWT token.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        username:
 *         type: string
 *        password:
 *         type: string
 *       required:
 *        - username
 *        - password
 *      example:
 *       username: "kate123"
 *       password: "secret123"
 *   responses:
 *    200:
 *     description: Login successful
 *    400:
 *     description: Validation error
 *    401:
 *     description: Invalid credentials
 *    500:
 *     description: Server error
 */
router.post('/user/login', loginUser);

/**
 * @swagger
 * /user/me:
 *  get:
 *   tags:
 *    - Auth
 *   summary: Get current logged-in user
 *   description: Returns the currently logged-in user profile (without password). Requires auth-token header.
 *   security:
 *    - ApiKeyAuth: []
 *   responses:
 *    200:
 *     description: Current user profile
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: User not found
 *    500:
 *     description: Server error
 */
router.get('/user/me', verifyToken, getMe);

//CRUD routes
//create
/**
 * @swagger
 * /recipes:
 *  post:
 *   tags:
 *    - Recipes
 *   summary: Create a recipe
 *   description: Creates a new recipe. Requires a valid JWT token.
 *   security:
 *    - ApiKeyAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Recipe'
 *      example:
 *       title: "Pasta Arrabbiata"
 *       ingredients:
 *        - "pasta"
 *        - "tomato sauce"
 *        - "chili"
 *       fullRecipe: "Boil pasta, make sauce, combine."
 *       tags:
 *        - "italian"
 *        - "quick"
 *       cookingTime: 20
 *       servings: 2
 *       image: "/uploads/pasta.jpg"
 *   responses:
 *    201:
 *     description: Recipe created successfully
 *    400:
 *     description: Validation error
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Server error
 */
router.post('/recipes', verifyToken, createRecipe);

//read
/**
 * @swagger
 * /recipes:
 *  get:
 *   tags:
 *    - Recipes
 *   summary: Get all recipes
 *   description: Returns a list of all recipes.
 *   responses:
 *    200:
 *     description: List of recipes
 *    500:
 *     description: Server error
 */
router.get('/recipes', getAllRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *  get:
 *   tags:
 *    - Recipes
 *   summary: Get a recipe by ID
 *   description: Returns a single recipe by its ID.
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Recipe found
 *    404:
 *     description: Recipe not found
 *    500:
 *     description: Server error
 */
router.get('/recipes/:id', getRecipeById);

//update
/**
 * @swagger
 * /recipes/{id}:
 *  put:
 *   tags:
 *    - Recipes
 *   summary: Update a recipe by ID
 *   description: Updates an existing recipe by its ID. Requires a valid JWT token.
 *   security:
 *    - ApiKeyAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Recipe'
 *   responses:
 *    200:
 *     description: Recipe updated successfully
 *    400:
 *     description: Validation error
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Recipe not found
 *    500:
 *     description: Server error
 */
router.put('/recipes/:id', verifyToken, updateRecipeById);

//delete
/**
 * @swagger
 * /recipes/{id}:
 *  delete:
 *   tags:
 *    - Recipes
 *   summary: Delete a recipe by ID
 *   description: Deletes an existing recipe by its ID. Requires a valid JWT token.
 *   security:
 *    - ApiKeyAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Recipe deleted successfully
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Recipe not found
 *    500:
 *     description: Server error
 */
router.delete('/recipes/:id', verifyToken, deleteRecipeById);

export default router;