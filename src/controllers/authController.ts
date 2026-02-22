import {
    type Request,
    type Response,
    type NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userEmail?: string;
            userUsername?: string;
            file?: Express.Multer.File;
        }
    }
}

import bcrypt from 'bcrypt';
import Joi, {ValidationResult} from 'joi';

//project imports
import { userModel} from "../models/userModel";
import {User} from "../interfaces/user";

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
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt
            }});

        


    } catch(error){
        res.status(500).send("Error registering user. Error: " + error);


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

    }
}

//get current logged-in user profile 
export async function getMe(req: Request, res: Response) {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }


        const user = await userModel.findById(req.userId).select('-password');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ error: null, data: user });
    } catch (error) {
        res.status(500).send('Error fetching user. Error: ' + error);
    }
}

//update current logged-in user profile (bio + optional profile image)
export async function updateMe(req: Request, res: Response) {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updates: Record<string, any> = {};

        const bioRaw = (req.body?.bio ?? '').toString();
        if (bioRaw.trim().length) {
            updates.bio = bioRaw.trim();
        }

        // multer provides file metadata on req.file
        const file = (req as any).file as { filename?: string; path?: string } | undefined;
        if (file) {
            // Prefer storing a public path like /uploads/<filename>
            if (file.filename) {
                updates.profileImage = `/uploads/${file.filename}`;
            } else if (file.path) {
                const normalized = file.path.replace(/\\/g, '/');
                const idx = normalized.lastIndexOf('/uploads/');
                updates.profileImage = idx >= 0 ? normalized.substring(idx) : (normalized.startsWith('/') ? normalized : `/${normalized}`);
            }
        }

        const user = await userModel.findByIdAndUpdate(
            req.userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ error: null, data: user });
    } catch (error) {
        res.status(500).send('Error updating user. Error: ' + error);
    }
}

//delete current logged-in user account (and delete all their recipes)
export async function deleteMe(req: Request, res: Response) {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.userId;

        // Try to delete recipes created by this user. This is resilient to different model export names.
        let deletedRecipes = 0;
        try {
            const mod: any = await import('../models/recipeModel');
            const recipeModelCandidate = mod.recipeModel ?? mod.RecipeModel ?? mod.default;
            if (recipeModelCandidate?.deleteMany) {
                const delRes = await recipeModelCandidate.deleteMany({
                    $or: [{ createdBy: userId }, { _createdBy: userId }],
                });
                deletedRecipes = (delRes?.deletedCount ?? 0) as number;
            }
        } catch {
            // Fallback: if the model is registered in mongoose under a common name
            const candidates = ['Recipe', 'recipe', 'recipes'];
            for (const name of candidates) {
                const m: any = (mongoose.models as any)[name];
                if (m?.deleteMany) {
                    const delRes = await m.deleteMany({
                        $or: [{ createdBy: userId }, { _createdBy: userId }],
                    });
                    deletedRecipes = (delRes?.deletedCount ?? 0) as number;
                    break;
                }
            }
        }

        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ error: null, data: { deletedUserId: userId, deletedRecipes } });
    } catch (error) {
        res.status(500).send('Error deleting user. Error: ' + error);
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