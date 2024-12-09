import app from "./src/app";
import {config} from "./src/config/config";
import { initializeDatabase } from './src/DBConnection';

const startServer = async () =>{
    const port = config.port || 3000;

    // await initializeDatabase();

    app.listen(port, () => {
        console.log(`server started at port: ${[port]}`);
    })
}

startServer();