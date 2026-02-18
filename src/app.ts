import express, {Application, Request, Response} from 'express';
import dotenvFlow from 'dotenv-flow';
import routes from './routes';
import {testConnection} from './repository/db';
import {setupDocs} from './util/documentation';
import cors from 'cors';


dotenvFlow.config();
//dotenvFlow.config();

//create express application
const app: Application = express();

//cors handling

function setupCors(){
    app.use(cors({
        // Allow requests from frontend dev servers
        origin: [
            "http://localhost:5173",
            "http://localhost:5174"
        ],

        // allow methods
        methods: ['GET', 'POST', 'PUT', 'DELETE'],

        // allow headers
        allowedHeaders: ['auth-token', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'],

        // allow credentials
        credentials: true
    }));
}


//setup cors
setupCors();

//JSON body parser middlerware
app.use(express.json());

//bind routes to the app
app.use('/api', routes);

//setup swagger documentation
setupDocs(app);

export function startServer(){

    //test db connection
    testConnection();

   const PORT: number = parseInt(process.env.PORT as string) || 4000;
    app.listen(PORT, function(){
        console.log("Server is up and running on port:" + PORT);
    });
}