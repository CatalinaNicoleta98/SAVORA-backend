import {Request, Response} from 'express';
import {recipeModel} from '../models/recipeModel';
import {connect, disconnect} from '../../repository/db';

//CRUD - Create, Read/get, Update, Delete
//creates new entry book in the data source based on the request body
export async function createRecipe(req: Request, res: Response): Promise<void> {
    const data = req.body;

    try{

        await connect();

        const recipe = new recipeModel(data);
        const result = await recipe.save();
        
        res.status(201).send(result);


    }catch(error){

        res.status(500).send("Error creating recipe entry");

    }finally {

        await disconnect();
    }
}


//retieves all recipes from the data source

export async function getAllRecipes(req: Request, res: Response) {

    try{

        await connect();

        
        const result = await recipeModel.find({});
        
        res.status(200).send(result);


    }catch (error) {

        res.status(500).send("error retrieving recipes. Error: " + error);

    }finally {

        await disconnect();
    }

} 

//retrieves a recipe entry by id from the data source
export async function getRecipeById(req: Request, res: Response) {

    try{

        await connect();

        const id = req.params.id;

        
        const result = await recipeModel.find({_id: id});
        
        res.status(200).send(result);


    }catch (error) {

        res.status(500).send("error retrieving recipes. Error: " + error);

    }finally {

        await disconnect();
    }

} 