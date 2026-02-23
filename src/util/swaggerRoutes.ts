


/**
 * @swagger
 * /:
 *  get:
 *   tags:
 *    - App Routes
 *   summary: Welcome to SAVORA
 *   description: This endpoint returns a welcome message to the SAVORA API.
 *   responses:
 *    200:
 *     description: A welcome message to the SAVORA API.
 */

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

/**
 * @swagger
 * /user/me:
 *  patch:
 *   tags:
 *    - Auth
 *   summary: Update current logged-in user
 *   description: Updates the currently logged-in user profile. Supports optional profile image upload. Requires auth-token header.
 *   security:
 *    - ApiKeyAuth: []
 *   requestBody:
 *    required: false
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        bio:
 *         type: string
 *         example: "Romantasy reader, kitchen experimenter, and recipe hoarder."
 *        profileImage:
 *         type: string
 *         format: binary
 *   responses:
 *    200:
 *     description: User updated successfully
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: User not found
 *    500:
 *     description: Server error
 */

/**
 * @swagger
 * /user/me:
 *  delete:
 *   tags:
 *    - Auth
 *   summary: Delete current logged-in user
 *   description: Deletes the current user account and also deletes all recipes created by this user. Requires auth-token header.
 *   security:
 *    - ApiKeyAuth: []
 *   responses:
 *    200:
 *     description: Account deleted successfully
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: User not found
 *    500:
 *     description: Server error
 */

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
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        title:
 *         type: string
 *        ingredients:
 *         type: array
 *         items:
 *          type: string
 *        fullRecipe:
 *         type: string
 *        tags:
 *         type: array
 *         items:
 *          type: string
 *        cookingTime:
 *         type: number
 *        servings:
 *         type: number
 *        image:
 *         type: string
 *         format: binary
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
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        title:
 *         type: string
 *        ingredients:
 *         type: array
 *         items:
 *          type: string
 *        fullRecipe:
 *         type: string
 *        tags:
 *         type: array
 *         items:
 *          type: string
 *        cookingTime:
 *         type: number
 *        servings:
 *         type: number
 *        image:
 *         type: string
 *         format: binary
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