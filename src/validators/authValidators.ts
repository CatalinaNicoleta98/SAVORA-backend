

import Joi, { ValidationResult } from 'joi';

// project imports
import { User } from '../interfaces/user';

// validate user registration data (username, email and password)
export function validateUserRegistration(data: User): ValidationResult {
    const schema = Joi.object({
        username: Joi.string().min(6).max(255).required(),
        email: Joi.string().email().min(6).max(255).required(),
        password: Joi.string().min(6).max(20).required(),
    });

    return schema.validate(data);
}

// validate user login data (username and password)
export function validateUserLogin(data: User): ValidationResult {
    const schema = Joi.object({
        username: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(20).required(),
    });

    return schema.validate(data);
}