import {
    type Request,
    type Response,
    type NextFunction,
} from 'express';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';
import Joi, {ValidationResult} from 'joi';

//project imports
import { userModel} from "../models/userModel";
import {User} from "../interfaces/user";
import {connect, disconnect} from '../repository/db';

//Register a new user

export async function registerUser(req:Request, res:Response){

    try{
            //validate the user and password
             const {error} = validateUserRegistration(req.body);

             if(error){
                res.status(400).json({error: error.details[0].message});
                return;
             }


            //check if the email is already registered

            await connect();

            const emailExist = await userModel.findOne({ email: req.body.email });

            if(emailExist){
                 res.status(400).json({error: "Email is already registered"});
                 return;
            }


            //hash the password
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(req.body.password, salt);

            //create a user object and save in the db
            const userObject = new userModel({
                name: req.body.name,
                email: req.body.email,
                password: passwordHashed
            });

            const savedUser = await userObject.save();
            res.status(200).json({error: null, data: savedUser._id});

        


    } catch(error){
        res.status(500).send("Error registering user. Error: " + error);


    } finally{
        
    }
};

//login



//validate user registration data(name, email and password)
export function validateUserRegistration(data: User): ValidationResult {

    const schema = Joi.object({
        name: Joi.string().min(6).max(255).required(),
        email: Joi.string().email().min(6).max(255).required(),
        password: Joi.string().min(6).max(20).required()
    });

    return schema.validate(data);

}


//validate user login data(name, email and password)
export function validateUserLogin(data: User): ValidationResult {

    const schema = Joi.object({
        email: Joi.string().email().min(6).max(255).required(),
        password: Joi.string().min(6).max(20).required()
    });

    return schema.validate(data);

}