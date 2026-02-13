export interface User extends Document {
  _id: string;

  username: string;
  email: string;
  password: string;      // hashed password

  createdAt?: Date;
  updatedAt?: Date;
}