import express, {Application, Request, Response} from 'express';
import dotenvFlow from 'dotenv-flow';
import routes from './routes';
import {testConnection} from '../repository/db';
import test from 'node:test';


dotenvFlow.config();
//dotenvFlow.config();

//create express application
const app: Application = express();

//JSON body parser middlerware
app.use(express.json());

//bind routes to the app
app.use('/api', routes);

export function startServer(){

    //test db connection
    testConnection();

   const PORT: number = parseInt(process.env.PORT as string) || 4000;
    app.listen(PORT, function(){
        console.log("Server is up and running on port:" + PORT);
    });
}