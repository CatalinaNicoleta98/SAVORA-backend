import express, {Application} from 'express';
import path from 'path';
import dotenvFlow from 'dotenv-flow';
import routes from './routes';
import {connect} from './repository/db';
import {setupDocs} from './util/documentation';
import { setupCors } from './util/cors';


dotenvFlow.config();

//create express application
const app: Application = express();


//setup cors
setupCors(app);

//JSON body parser middlerware
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

//bind routes to the app
app.use('/api', routes);

//setup swagger documentation
setupDocs(app);

export async function startServer(){

    // connect to DB once at startup, keep it open
    await connect();

    const port = Number(process.env.PORT) || 4000;

    app.listen(port, function () {
        console.log(`Server is up and running on port: ${port}`);
    });
}