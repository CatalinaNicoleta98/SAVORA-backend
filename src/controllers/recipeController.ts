import {Request, Response} from 'express';
import {recipeModel} from '../models/recipeModel';
import {connect, disconnect} from '../repository/db';

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

//updates a recipe entry by id in the data source based on the request body
export async function updateRecipeById(req: Request, res: Response) {

    const id = req.params.id;

    try{

        await connect();

    
        const result = await recipeModel.findByIdAndUpdate(id, req.body);

        if(!result){
            res.status(404).send('Cannot update recipe entry with id= ' + id );
        }else{
            res.status(200).send('Recipe entry was updated successfully.');
        }
        

    
    }catch (error) {

        res.status(500).send("Error updating recipe entry by id. Error: " + error);

    }finally {

        await disconnect();
    }
}

//deletes a recipe entry by id from the data source
export async function deleteRecipeById(req: Request, res: Response) {

    const id = req.params.id;

    try{

        await connect();

        const result = await recipeModel.findByIdAndDelete(id);

        if(!result){
            res.status(404).send('Cannot delete recipe entry with id= ' + id );
        }else{
            res.status(200).send('Recipe entry was deleted successfully.');
        }
        

    
    }catch (error) {

        res.status(500).send("Error deleting recipe entry by id. Error: " + error);

    }finally {

        await disconnect();
    }

} 
