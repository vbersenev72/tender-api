import db from '../models/index.js'
import connectDB from "../../db/mongoCLient.js";
import { config } from "dotenv";



const Tag = db.tag
const TendersData = db.tendersData

class TagController {
    async createTag(req, res) {
        try {
            const id = req.user.id
            const { name, color, } = req.body

            const candidateTag = await Tag.findOne({
                where: {
                    tag_name: name,
                    user_id: id
                }
            })

            if (candidateTag) return res.status(400).json({ message: 'Имя метки уже используется!' })

            const createTag = await Tag.create({
                user_id: id,
                tag_name: name,
                tag_color: color,
            })

            return res.json({ message: 'Метка создана', createTag })
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка' })
        }



    }

    async deleteTag(req, res) {

        try {
            const id = req.user.id
            const idTag = req.params.id

            const findTag = await Tag.findOne({
                where: {
                    user_id: id,
                    id: Number(idTag)
                }
            })

            if (!findTag) return res.status(400).json({ message: 'Метки не существует' })

            const deleteTag = await Tag.destroy({
                where: {
                    user_id: id,
                    id: Number(idTag)
                }
            })

            return res.json({ message: 'Метка удалена' })
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка' })
        }

    }

    async editTag(req, res) {

        try {
            const id = req.user.id
            const { name, idTag } = req.body

            const findTag = await Tag.findOne({
                where: {
                    user_id: id,
                    id: Number(idTag)
                }
            })

            if (!findTag) return res.status(400).json({ message: 'Метки не существует' })

            const updateTag = await Tag.update({
                tag_name: name,
            }, {
                where: {
                    user_id: id,
                    id: Number(idTag)
                }
            })

            return res.json({ message: 'Метка изменена' })
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка' })
        }


    }

    async getTendersByTag(req, res) {

        try {

            const id = req.user.id
            const { page, idTag } = req.body

            const limit = 8

            const tenders = await TendersData.findAll({
                where: {
                    user_id: id,
                    tag_id: idTag
                },
                limit: limit,
                offset: (page - 1) * limit

            })

            const result = []

            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            for (let i = 0; i < tenders.length; i++) {
                const element = tenders[i];

                const tender = await collection.findOne({
                    $or: [
                        { "commonInfo.purchaseNumber": String(element.reg_num) },
                        { registrationNumber: String(element.reg_num) }
                    ]
                })

                if (tender == null) continue

                result.push(tender)
            }

            return res.json({ message: result })



        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка' })
        }

    }

    async getCountTendersByTag(req, res) {
        try {

            const id = req.user.id
            const { idTag } = req.body


            let tenders = await TendersData.findAll({
                where: {
                    user_id: id,
                    tag_id: idTag
                }

            })


            return res.json({ message: tenders.length })


        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка' })
        }
    }

    async addTagToTender(req, res) {

        const id = req.user.id
        const { idTag, regNum } = req.body

        const findTag = await Tag.findOne({
            where: {
                user_id: id,
                id: Number(idTag)
            }
        })

        if (!findTag) return res.status(400).json({ message: 'Метки не существует' })

        const deleteBeforeTags = await TendersData.destroy({
            where: {
                user_id: id,
                reg_num: String(regNum)
            }
        })



        const addTag = TendersData.create({
            user_id: id,
            reg_num: String(regNum),
            tag_id: Number(idTag)
        })


        return res.json({ message: 'Метка добавлена' })

    }

    async deleteTagFromTender(req, res) {
        const id = req.user.id
        const { idTag, regNum } = req.body

        const findTag = await Tag.findOne({
            where: {
                user_id: id,
                id: Number(idTag)
            }
        })

        if (!findTag) return res.status(400).json({ message: 'Метки не существует' })

        const findAddedTag = await TendersData.findOne({
            where: {
                user_id: id,
                tag_id: Number(idTag),
                reg_num: String(regNum)
            }
        })

        if (!findAddedTag) return res.status(400).json({ message: 'Метка не добавлена' })


        const deleteTagFromTender = TendersData.destroy({
            where: {
                user_id: id,
                tag_id: Number(idTag),
                reg_num: String(regNum)
            }
        })

        return res.json({ message: 'Метка удалена' })
    }

    async getAllTags(req, res) {
        try {

            const id = req.user.id

            let tags = await Tag.findAll({
                where: {
                    user_id: id
                }
            })




            return res.json({ message: tags })


        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка' })
        }
    }

}


export default new TagController()