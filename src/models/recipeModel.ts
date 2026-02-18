import  { Schema, model } from "mongoose";
import { Recipe } from "../interfaces/recipe";

const recipeSchema = new Schema<Recipe>(
  {
    title: {
      type: String,
      required: true,
      min: 2,
      max: 255,
    },

    ingredients: {
      type: [String],
      required: true,
    },

    fullRecipe: {
      type: String,
      required: true,
      min: 10,
    },

    // Optional filtering
    tags: {
      type: [String],
    },

    diet: {
      type: [String],
    },

    allergens: {
      type: [String],
    },

    difficulty: { 
      type: String, 
      enum: ["easy", "medium", "hard"], 
      default: "easy" 
    },

    cookingTime: {
      type: Number,
    },

    servings: {
      type: Number,
    },

    // Image
    image: {
      type: String,
    },

    // Ownership
    createdBy: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

export const recipeModel = model<Recipe>('Recipe', recipeSchema);