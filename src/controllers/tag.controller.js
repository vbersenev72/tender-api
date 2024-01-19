import db from '../models/index.js'

const Tag = db.tag

class TagController {
    async createTag(req, res) {

        const id = req.user.id
        const {name, color, regNum} = req.body

        const candidateTag = await Tag.findOne({
            where: {
                tag_name: name,
                user_id: id
            }
        })

        if (candidateTag) return res.status(400).json({message: 'Имя метки уже используется!'})

        const createTag = await Tag.create({
            user_id: id,
            tag_name: name,
            tag_color: color,
            reg_num: regNum
        })

        return res.json({message: 'created successfully', createTag})

    }

    async deleteTag(req, res) {

    }

    async editTag(req, res) {

    }

    async getTendersByTag(req, res) {

    }

    async addTagToTender(req, res) {

    }

    async deleteTagFromTender(req, res) {

    }


}