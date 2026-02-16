import {
    type Request,
    type Response,
    type NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userEmail?: string;
            userUsername?: string;
        }
    }
}

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
                username: req.body.username,
                email: req.body.email,
                password: passwordHashed,
            });

            const savedUser = await userObject.save();
            res.status(201).json({error: null, data: {
                _id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                passwordHashed: savedUser.password,
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt
            }});

        


    } catch(error){
        res.status(500).send("Error registering user. Error: " + error);


    } finally{
        disconnect();
    }
};

//login

export async function loginUser(req:Request, res:Response){
    try{

        //validate user login info

        const {error} = validateUserLogin(req.body);
        if (error){
            res.status(400).json({error: error.details[0].message});
            return;
        }


        //find the user in the repository
        await connect();

        const user: User | null = await userModel.findOne({ username: req.body.username });

        if(!user){
            res.status(400).json({error: "Username or password is wrong"});
            return;
        }else{
                    //create auth token and send it back
            const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword){
                res.status(400).json({error: "Username or password is wrong"});
                return;
            }

            const userId: string = user._id;
            const token: string = jwt.sign(
                {
                    //payload
                    username: user.username,
                    email: user.email,
                    id: userId
                },
                process.env.TOKEN_SECRET as string, 
                {expiresIn: '2h'}
               

            ); 

            //attach the token and send it back to the client

            res.status(200).header("auth-token", token).json({error:null, data:{userId, token}});



        }


    } catch(error){

        res.status(500).send("Error logging in user. Error: " + error);

    }finally{

        await disconnect();

    }
}

//get current logged-in user profile 
export async function getMe(req: Request, res: Response) {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        await connect();

        const user = await userModel.findById(req.userId).select('-password');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ error: null, data: user });
    } catch (error) {
        res.status(500).send('Error fetching user. Error: ' + error);
    } finally {
        await disconnect();
    }
}

//middleware to verify the token and protect routes
export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).json({ error: 'Access denied, no token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as {
            id: string;
            email?: string;
            username?: string;
            iat?: number;
            exp?: number;
        };

        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.userUsername = decoded.username;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}




//validate user registration data(name, email and password)
export function validateUserRegistration(data: User): ValidationResult {

    const schema = Joi.object({
        username: Joi.string().min(6).max(255).required(),
        email: Joi.string().email().min(6).max(255).required(),
        password: Joi.string().min(6).max(20).required()
    });

    return schema.validate(data);

}


//validate user login data(name, email and password)
export function validateUserLogin(data: User): ValidationResult {

    const schema = Joi.object({
        username: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(20).required()
    });

    return schema.validate(data);

}