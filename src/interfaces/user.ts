export interface User extends Document {
  _id: string;

  username: string;
  email: string;
  password: string; // hashed password

  // profile
  bio?: string;
  profileImage?: string; // stored as a public path like /uploads/<filename>

  createdAt?: Date;
  updatedAt?: Date;
}