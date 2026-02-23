import {Schema, model} from 'mongoose'
import { User } from '../interfaces/user';

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 1000,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "", // stored as /uploads/<filename>
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

export const userModel = model<User>('User', userSchema);