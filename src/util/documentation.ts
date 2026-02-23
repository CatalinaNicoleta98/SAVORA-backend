import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Application } from 'express';
import path from 'path';

//Swagger definition
export function setupDocs(app: Application){

    const publicApiBaseUrl = (process.env.PUBLIC_API_BASE_URL || 'http://localhost:4000/api').replace(/\/+$/, '');

    //swagger definition

    const swaggerDefinition = {

        openapi: '3.0.0',

        info: {
            title: 'SAVORA',
            version: '1.0.0',
            description: 'SAVORA, API documentation for the recipe sharing application. Compulsory individual project',
        },
        servers: [
            {
                url: publicApiBaseUrl,
                description: 'API base URL',
            },
        ],
        components: {
            securitySchemes:{
                ApiKeyAuth:{
                    type: 'apiKey',
                    in: 'header',
                    name: 'auth-token'
                },
            },
            schemas: {
                Recipe: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },

                        // Required
                        title: { type: 'string' },
                        ingredients: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                        fullRecipe: { type: 'string' },

                        // Optional filtering
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                        diet: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                        allergens: {
                            type: 'array',
                            items: { type: 'string' },
                        },

                        cookingTime: { type: 'number' },
                        servings: { type: 'number' },

                        // Image
                        image: { type: 'string' },

                        // Ownership
                        createdBy: { type: 'string' },

                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['title', 'ingredients', 'fullRecipe', 'createdBy'],
                },

                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['username', 'email', 'password'],
                },
            },
        }
        
    };

    //swagger options

    const options = {
        definition: swaggerDefinition,
        apis: [
            // Local dev (TypeScript)
            path.join(process.cwd(), 'src/**/*.ts'),
            // Production build on Render (JavaScript)
            path.join(process.cwd(), 'dist/**/*.js'),
        ],
    };

    //swagger specifications
    const swaggerSpec = swaggerJSDoc(options);
    //create docs route
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
