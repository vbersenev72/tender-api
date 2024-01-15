import express from 'express'
import { config } from "dotenv"
import router from './src/routers/index.js'
import cors from 'cors'

config()

const PORT = process.env.PORT


const app = express()

app.use(express.json())
app.use(cors());
app.use('/api', router)

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`started on ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}
start()