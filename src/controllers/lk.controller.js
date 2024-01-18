import connectDB from "../../db/mongoCLient.js";
import { config } from "dotenv";
import db from "../models/index.js";

config()


const Users = db.users
const MyTenders = db.myTenders


class LkController {
    async saveInMyTenders(req, res) {
        try {

            const { regNum } = req.body
            const id = req.user.id

            const findMyTender = await MyTenders.findOne({
                where: {
                    reg_num: String(regNum),
                    user_id: id
                }
            })

            if (findMyTender) return res.status(400).json({ message: 'tender already exists' })

            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            const findTender = await collection.findOne(
                {
                    $or: [
                        { registrationNumber: regNum },
                        { 'commonInfo.purchaseNumber': regNum }
                    ]
                }
            )
            if (!findTender) return res.status(400).json({ message: 'tender not defined' })

            const createMyTender = await MyTenders.create({
                user_id: id,
                reg_num: String(regNum)
            })

            return res.json({ message: createMyTender })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "error", error })
        }
    }

    async deleteFromMyTenders(req, res) {
        try {

            const regNum = req.params.id
            const id = req.user.id

            const findMyTender = await MyTenders.findOne({
                where: {
                    reg_num: String(regNum),
                    user_id: id
                }
            })

            if (!findMyTender) return res.status(400).json({ message: 'tender not defined' })

            const deleteMyTender = await MyTenders.destroy({
                where: {
                    user_id: id,
                    reg_num: String(regNum)
                }
            })

            return res.json({ message: deleteMyTender })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "error", error })
        }
    }

    async getMyTenders(req, res) {
        try {

            const id = req.user.id
            const page = req.params.page

            const limit = 8

            const myTenders = await MyTenders.findAll({
                where: {
                    user_id: id
                },
                limit: limit,
                offset: (page - 1) * limit

            })

            return res.json({ message: myTenders })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "error", error })
        }
    }

}


export default new LkController()