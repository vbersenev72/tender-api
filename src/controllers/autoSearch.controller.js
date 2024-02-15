import db from '../models/index.js'
import connectDB from '../../db/mongoCLient.js'
import { config } from 'dotenv'

config()

const AutoSearch = db.autoSearch
const AutoSearchResult = db.autoSearchResult

class AutoSearchController {
    async createAutoSearch(req, res) {
        try {
            const id = req.user.id
            let {

                name,
                tags,
                stopTags,
                publicDateFrom, publicDateTo,
                startDateFrom, startDateTo,
                endDateFrom, endDateTo,
                fz,
                region,
                tenderNum,
                customerName, stopCustomerName,
                inn,
                priceFrom, priceTo, enablePrice,
                purchaseStage,
                methodDeterminingSupplier,
                source, enableSource,
                okpd2,


            } = req.body

            const candidate = await AutoSearch.findOne({
                where: {
                    user_id: id,
                    name: name
                }
            })

            if (candidate) return res.status(400).json({ message: 'Автопоиск с таким именем уже существует!' })

            const createAutoSearch = await AutoSearch.create({
                user_id: id,
                name: name,
                tags: tags,
                stopTags,
                publicDateFrom: publicDateFrom,
                publicDateTo: publicDateTo,
                startDateFrom: startDateFrom,
                startDateTo: startDateTo,
                endDateFrom: endDateFrom,
                endDateTo: endDateTo,
                fz: fz,
                region: region,
                tenderNum: tenderNum,
                customerName: customerName,
                stopCustomerName: stopCustomerName,
                inn: inn,
                priceFrom: priceFrom,
                priceTo: priceTo,
                enablePrice: enablePrice,
                source: source,
                enableSource: enableSource,
                okpd2: okpd2,
                methodDeterminingSupplier: methodDeterminingSupplier

            })

            return res.json({ message: 'Автопоиск успешно задан!' })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }


    async editAutoSearch(req, res) {
        try {

            const id = req.user.id
            let {

                tags,
                stopTags,
                publicDateFrom, publicDateTo,
                startDateFrom, startDateTo,
                endDateFrom, endDateTo,
                fz,
                region,
                tenderNum,
                customerName, stopCustomerName,
                inn,
                priceFrom, priceTo, enablePrice,
                purchaseStage,
                methodDeterminingSupplier,
                source, enableSource,
                okpd2,


                autoSearchId

            } = req.body

            const candidate = await AutoSearch.findOne({
                where: {
                    id: autoSearchId,
                }
            })

            if (!candidate) return res.status(400).json({ message: 'Автопоиск не существует!' })

            const updateAutoSearch = await AutoSearch.update({

                tags: tags,
                stopTags,
                publicDateFrom: publicDateFrom,
                publicDateTo: publicDateTo,
                startDateFrom: startDateFrom,
                startDateTo: startDateTo,
                endDateFrom: endDateFrom,
                endDateTo: endDateTo,
                fz: fz,
                region: region,
                tenderNum: tenderNum,
                customerName: customerName,
                stopCustomerName: stopCustomerName,
                inn: inn,
                priceFrom: priceFrom,
                priceTo: priceTo,
                enablePrice: enablePrice,
                source: source,
                enableSource: enableSource,
                okpd2: okpd2,
                methodDeterminingSupplier: methodDeterminingSupplier

            }, {
                where: {
                    user_id: id,
                    id: autoSearchId
                }
            })


            return res.json({ message: 'Автопоиск изменён!' })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }

    async editName(req, res) {
        const id = req.user.id
        let {
            name,
            autoSearchId
        } = req.body

        const candidate = await AutoSearch.findOne({
            where: {
                id: autoSearchId,
            }
        })

        if (!candidate) return res.status(400).json({ message: 'Автопоиск не существует!' })

        const updateAutoSearch = await AutoSearch.update({
            name: name,

        }, {
            where: {
                user_id: id,
                id: autoSearchId
            }
        })


        return res.json({ message: 'Автопоиск изменён!' })
    }

    async deleteAutoSearch(req, res) {
        try {

            const id = req.user.id
            const autoSearchId = req.params.id

            const candidate = await AutoSearch.findOne({
                where: {
                    id: autoSearchId,
                }
            })
            if (!candidate) return res.status(400).json({ message: 'Автопоиск не существует!' })

            const deleteAutoSearch = await AutoSearch.destroy({
                where: {
                    user_id: id,
                    id: autoSearchId
                }
            })

            const deleteAutoSearchResult = await AutoSearchResult.destroy({
                where: {
                    user_id: id,
                    autosearch_id: autoSearchId
                }
            })

            return res.json({ message: 'Автопоиск удалён!' })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }

    async getAutoSearch(req, res) {
        try {

            const id = req.user.id
            const autoSearchId = req.params.id

            const autoSearch = await AutoSearch.findOne({
                where: {
                    user_id: id,
                    id: autoSearchId
                }
            })

            if (!autoSearch) return res.status(400).json({ message: 'Автопоиск не найден!' })

            return res.json({ message: autoSearch })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }


    async getAllAutoSearch(req, res) {
        try {

            const id = req.user.id

            const autoSearch = await AutoSearch.findAll({
                where: {
                    user_id: id,
                }
            })

            return res.json({ message: autoSearch })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }



    async getResultAutoSearch(req, res) {
        try {

            const id = req.user.id
            const autoSearchId = req.params.id
            const page = req.query.page
            const limit = req.query.limit


            const candidate = await AutoSearch.findOne({
                where: {
                    id: autoSearchId,
                }
            })
            if (!candidate) return res.status(400).json({ message: 'Автопоиск не существует!' })

            const count = await AutoSearchResult.findAll({
                where: {
                    user_id: id,
                    autosearch_id: autoSearchId,
                    isRead: false
                },
            })
            const totalItems = count.length

            let tenders

            if (count > 9) {
                tenders = await AutoSearchResult.findAll({
                    where: {
                        user_id: id,
                        autosearch_id: autoSearchId,
                        isRead: false
                    },
                    limit: limit,
                    offset: (totalItems - page * limit),
                })

            } else {
                tenders = await AutoSearchResult.findAll({
                    where: {
                        user_id: id,
                        autosearch_id: autoSearchId,
                        isRead: false
                    },
                    limit: limit,
                    offset: (page - 1) * limit,
                })
            }


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
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }

    async getCountResultAutoSearch(req, res) {
        try {

            const id = req.user.id
            const autoSearchId = req.params.id

            const tenders = await AutoSearchResult.findAll({
                where: {
                    user_id: id,
                    autosearch_id: autoSearchId,
                    isRead: false
                },
            })

            return res.json({ message: tenders.length })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }


    async getResultIsRead(req, res) {
        try {

            const id = req.user.id
            const autoSearchId = req.params.id

            const page = req.query.page

            const limit = 8

            const candidate = await AutoSearch.findOne({
                where: {
                    id: autoSearchId,
                }
            })
            if (!candidate) return res.status(400).json({ message: 'Автопоиск не существует!' })


            const tenders = await AutoSearchResult.findAll({
                where: {
                    user_id: id,
                    autosearch_id: autoSearchId,
                    isRead: true
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
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }


    async isReadMark(req, res) {
        try {

            const id = req.user.id
            const regNum = req.params.id

            const candidate = await AutoSearchResult.findOne({
                where: {
                    reg_num: regNum,
                    user_id: id
                }
            })
            if (!candidate) return res.status(400).json({ message: 'Автопоиск не существует!' })

            const createReadMark = await AutoSearchResult.update({
                isRead: true
            }, {
                where: {
                    user_id: id,
                    reg_num: regNum,
                }
            })

            return res.json({ message: 'Отмечено как прочитанное!' })



        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }

}

export default new AutoSearchController()