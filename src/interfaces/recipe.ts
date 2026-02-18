import {User} from "./user";

export interface Recipe extends Document {
  _id: string;

  // Required
  title: string;
  ingredients: string[];
  fullRecipe: string;        // full recipe text (instructions + description)

  // Optional filtering
  tags?: string[];        // ["italian", "quick", "spicy"]
  diet?: string[];        // ["vegetarian", "vegan"]
  allergens?: string[];   // ["nuts", "dairy"]
  difficulty?: "easy" | "medium" | "hard";    // literal union type, it can only be exactly one of these three values
  cookingTime?: number;   // minutes
  servings?: number;

  // Image
  image?: string;         // "/uploads/xyz.jpg"

  // Ownership
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}