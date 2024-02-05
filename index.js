import express from 'express'
import { config } from "dotenv"
import router from './src/routers/index.js'
import cors from 'cors'
import fileUpload from 'express-fileupload';
import { AutoSearch } from './src/workers/autoSearchWorker.js';
import cron from 'node-cron'


config()

const PORT = process.env.PORT


const app = express()

app.use(express.json())
app.use(cors());
app.use('/api', router)
app.use(fileUpload({}))
app.use(express.static('files'))

const start = async () => {
    try {
        
        app.listen(PORT, () => console.log(`started on ${PORT}`))

        cron.schedule('0 0 */1 * *', () => {
            AutoSearch()
            console.log('цикл');
        });


    } catch (error) {
        console.log(error);
    }
}
start()