import mongodb from 'mongodb'
import { MongoClient } from 'mongodb'
import 'dotenv/config'


const url = process.env.MONGO

async function connectDB() {
    try {
        console.log(url);
        const client = await MongoClient.connect(url);
        console.log('Подключение к базе данных успешно');
        return client;
    } catch (err) {
        console.error('Ошибка подключения к базе данных:', err);
        throw err;
    }
}

export default connectDB