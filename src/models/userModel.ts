import {Schema, model} from 'mongoose'
import { User } from '../interfaces/user';

const userSchema = new Schema<User>({
  username: { 
    type: String, 
    required: true, 
    min: 2, 
    max: 100 
  },

  email: { 
    type: String, 
    required: true, 
    min: 6, 
    max: 255, 
    unique: true 
  },

  password: { 
    type: String, 
    required: true, 
    min: 6, 
    max: 255 
  },

  createdAt: { 
    type: Date, 
    required: true, 
    default: Date.now 
  }
});

export const userModel = model<User>('User', userSchema);