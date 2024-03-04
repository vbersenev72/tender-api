import db from '../models/index.js'
import connectDB from '../../db/mongoCLient.js'
import { config } from 'dotenv'
import { read } from 'fs'

config()

const AutoSearch = db.autoSearch
const AutoSearchResult = db.autoSearchResult
const isReadTenders = db.isReadTenders

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
                stopCustomerName: String(stopCustomerName),
                inn: inn,
                priceFrom: priceFrom,
                priceTo: priceTo,
                enablePrice: enablePrice,
                source: source,
                enableSource: enableSource,
                okpd2: okpd2,
                methodDeterminingSupplier: methodDeterminingSupplier,
                purchaseStage: purchaseStage

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
                stopCustomerName: String(stopCustomerName),
                inn: inn,
                priceFrom: priceFrom,
                priceTo: priceTo,
                enablePrice: enablePrice,
                source: source,
                enableSource: enableSource,
                okpd2: okpd2,
                methodDeterminingSupplier: methodDeterminingSupplier,
                purchaseStage: purchaseStage
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
            const sort = req?.query?.sort ? req?.query?.sort : 'publicDate'

            let start = Number(page) * limit
            if (page == 1) {
                start = 0
            }


            // publicDate, customDate, Price, FinishDate
            // publicDateReverse, customDateRevers, PriceReverse, FinishDateReverse

            const autoSearchParams = await AutoSearch.findOne({
                where: {
                    id: autoSearchId,
                }
            })
            if (!autoSearchParams) return res.status(400).json({ message: 'Автопоиск не существует!' })

            const readed = await isReadTenders.findAll({
                where: {
                    user_id: id,
                },
            })

            const newTenders = await AutoSearchResult.findAll({where: {
                user_id: id,
                autosearch_id: autoSearchId
            }})

            const countNewTenders = newTenders.length

            const query = []

            if (autoSearchParams.tags == "" && autoSearchParams.stopTags != "") {
                const regexArray = autoSearchParams.stopTags.split(' ').map(word => new RegExp(word, 'i'));

                query.push({
                    'commonInfo.purchaseObjectInfo': { $not: { $in: regexArray } },
                    name: { $not: { $in: regexArray } }
                })


            }

            if (autoSearchParams.tags != "" && autoSearchParams.stopTags == "") {

                query.push(
                    { $text: { $search: tags } }, { score: { $meta: "text Score" } }
                )

            }

            if (autoSearchParams.tags != "" && autoSearchParams.stopTags != "") {
                const regexArray = autoSearchParams.stopTags.split(' ').map(word => new RegExp(word, 'i'));

                query.push(
                    {
                        $or: [
                            { "commonInfo.purchaseObjectInfo": { $in: autoSearchParams.tags.split(' ').map(word => new RegExp(word, 'i')), } },
                            { name: { $in: autoSearchParams.tags.split(' ').map(word => new RegExp(word, 'i')), } }
                        ]
                    },
                )

                query.push(
                    {
                        'commonInfo.purchaseObjectInfo': { $not: { $in: regexArray } },
                        name: { $not: { $in: regexArray } }
                    }
                )
            }

            if (autoSearchParams.publicDateFrom == '' && autoSearchParams.publicDateTo != '') {

                query.push({
                    $or: [
                        { 'publicationDateTime': { $lte: new Date(autoSearchParams.publicDateTo).toISOString() } },
                        { 'commonInfo.publishDTInEIS': { $lte: new Date(autoSearchParams.publicDateTo).toISOString() } }
                    ]
                })
            }

            if (autoSearchParams.publicDateFrom != '' && autoSearchParams.publicDateTo == '') {

                query.push({
                    $or: [
                        { 'publicationDateTime': { $gte: new Date(autoSearchParams.publicDateFrom).toISOString() } },
                        { 'commonInfo.publishDTInEIS': { $gte: new Date(autoSearchParams.publicDateFrom).toISOString() } }
                    ]
                })

            }

            if (autoSearchParams.publicDateFrom != '' && autoSearchParams.publicDateTo != '') {

                query.push({
                    $and: [
                        {
                            $or: [
                                { 'publicationDateTime': { $gte: new Date(autoSearchParams.publicDateFrom).toISOString() } },
                                { 'commonInfo.publishDTInEIS': { $gte: new Date(autoSearchParams.publicDateFrom).toISOString() } }
                            ]
                        },
                        {
                            $or: [
                                { 'publicationDateTime': { $lte: new Date(autoSearchParams.publicDateTo) } },
                                { 'commonInfo.publishDTInEIS': { $lte: new Date(autoSearchParams.publicDateTo) } }
                            ]
                        }

                    ]
                })

            }

            if (autoSearchParams.startDateFrom != '' && autoSearchParams.startDateTo == '') {
                query.push({
                    $or: [
                        { 'publicationDateTime': { $gte: new Date(autoSearchParams.startDateFrom).toISOString() } },
                        { 'notificationInfo.procedureInfo.collectingInfo.startDT': { $gte: new Date(autoSearchParams.startDateFrom).toISOString() } }
                    ]
                })
            }

            if (autoSearchParams.startDateFrom == '' && autoSearchParams.startDateTo != '') {
                query.push({
                    $or: [
                        { 'publicationDateTime': { $lte: new Date(autoSearchParams.startDateTo).toISOString() } },
                        { 'notificationInfo.procedureInfo.collectingInfo.startDT': { $lte: new Date(autoSearchParams.startDateTo).toISOString() } }
                    ]
                })
            }

            if (autoSearchParams.startDateFrom != '' && autoSearchParams.startDateTo != '') {
                query.push({
                    $and: [
                        {
                            $or: [
                                { 'publicationDateTime': { $lte: new Date(autoSearchParams.startDateTo) } },
                                { 'notificationInfo.procedureInfo.collectingInfo.startDT': { $lte: new Date(autoSearchParams.startDateTo) } }
                            ],
                            $or: [
                                { 'publicationDateTime': { $gte: new Date(autoSearchParams.startDateFrom) } },
                                { 'notificationInfo.procedureInfo.collectingInfo.startDT': { $gte: new Date(autoSearchParams.startDateFrom) } }
                            ]
                        }
                    ]
                })
            }


            if (autoSearchParams.endDateFrom != '' && autoSearchParams.endDateTo == '') {
                query.push({
                    $or: [
                        { 'submissionCloseDateTime': { $gte: new Date(autoSearchParams.endDateFrom) } },
                        { 'notificationInfo.procedureInfo.collectingInfo.endDT': { $gte: new Date(autoSearchParams.endDateFrom) } }
                    ]
                })
            }

            if (autoSearchParams.endDateFrom == '' && autoSearchParams.endDateTo != '') {
                query.push({
                    $or: [
                        { 'submissionCloseDateTime': { $lte: new Date(autoSearchParams.endDateTo) } },
                        { 'notificationInfo.procedureInfo.collectingInfo.endDT': { $lte: new Date(autoSearchParams.endDateTo) } }
                    ]
                })
            }

            if (autoSearchParams.endDateFrom != '' && autoSearchParams.endDateTo != '') {
                query.push({
                    $and: [
                        {
                            $or: [
                                { 'submissionCloseDateTime': { $gte: new Date(autoSearchParams.endDateFrom) } },
                                { 'notificationInfo.procedureInfo.collectingInfo.endDT': { $gte: new Date(autoSearchParams.endDateFrom) } }
                            ],
                        },
                        {
                            $or: [
                                { 'submissionCloseDateTime': { $lte: new Date(autoSearchParams.endDateTo) } },
                                { 'notificationInfo.procedureInfo.collectingInfo.endDT': { $lte: new Date(autoSearchParams.endDateTo) } }
                            ]
                        }
                    ]

                })
            }


            if (autoSearchParams.region != '') {

                const regions = autoSearchParams.region.split(/;| /).filter(value => value !== '');

                const regexQueryFor223 = regions.map(value => ({
                    'customer.mainInfo.region': { $regex: value, $options: 'i' }
                }));

                const regexQueryFor44 = regions.map(value => ({
                    'purchaseResponsibleInfo.responsibleOrgInfo.postAddress': { $regex: value, $options: 'i' }
                }));

                query.push({
                    $or: [...regexQueryFor223, ...regexQueryFor44]
                });

                // разраб парсера положил хуй на поле региона у тендеров с 44 ФЗ - как только исправит нужно добавить это поле сюды
            }

            if (autoSearchParams.tenderNum != '') {
                const tenderNums = autoSearchParams.tenderNum.split(' ')

                query.push({
                    $or: [
                        { 'registrationNumber': { $in: tenderNums } },
                        { 'commonInfo.purchaseNumber': { $in: tenderNums } },
                    ]
                })

            }

            if (autoSearchParams.customerName != "") {

                if (String(autoSearchParams.stopCustomerName) == 'true') {
                    query.push({
                        'customer.mainInfo.fullName': { $not: { $regex: autoSearchParams.customerName, $options: 'i' } },
                        'purchaseResponsibleInfo.responsibleOrgInfo.fullName': { $not: { $regex: autoSearchParams.customerName, $options: 'i' } }
                    })
                } else {
                    query.push({
                        $or: [
                            { 'customer.mainInfo.fullName': { $regex: autoSearchParams.customerName, $options: 'i' } },
                            { 'purchaseResponsibleInfo.responsibleOrgInfo.fullName': { $regex: autoSearchParams.customerName, $options: 'i' } }
                        ]
                    })
                }

            }

            if (autoSearchParams.inn != "") {
                const inns = autoSearchParams.inn.split(' ')

                query.push({
                    $or: [
                        { 'customer.mainInfo.inn': { $in: inns } },
                        { 'purchaseResponsibleInfo.responsibleOrgInfo.INN': { $in: inns } },
                    ]
                })
            }

            if (autoSearchParams.priceFrom == "" && autoSearchParams.priceTo != "") {
                query.push({
                    $or: [
                        { 'notificationInfo.contractConditionsInfo.maxPriceInfo.maxPrice': { $lte: autoSearchParams.priceTo } },
                        { 'lots.lot.lotData.initialSum': { $lte: autoSearchParams.priceTo } }
                    ]
                })
            }

            if (autoSearchParams.priceFrom != "" && autoSearchParams.priceTo == "") {
                query.push({
                    $or: [
                        { 'notificationInfo.contractConditionsInfo.maxPriceInfo.maxPrice': { $gte: autoSearchParams.priceFrom } },
                        { 'lots.lot.lotData.initialSum': { $gte: autoSearchParams.priceFrom } }
                    ]
                })
            }

            if (autoSearchParams.priceFrom != "" && autoSearchParams.priceTo != "") {
                query.push({
                    $and: [
                        {
                            $or: [
                                { 'notificationInfo.contractConditionsInfo.maxPriceInfo.maxPrice': { $lte: autoSearchParams.priceTo } },
                                { 'lots.lot.lotData.initialSum': { $lte: autoSearchParams.priceTo } }
                            ]
                        },
                        {
                            $or: [
                                { 'notificationInfo.contractConditionsInfo.maxPriceInfo.maxPrice': { $gte: autoSearchParams.priceFrom } },
                                { 'lots.lot.lotData.initialSum': { $gte: autoSearchParams.priceFrom } }
                            ]
                        }
                    ]
                })
            }

            if (autoSearchParams.source != "") {
                query.push({
                    $or: [
                        { 'urlEIS': { $regex: autoSearchParams.source, $options: 'i' } },
                        { "commonInfo.href": { $regex: autoSearchParams.source, $options: 'i' } }
                    ]
                })
            }


            if (autoSearchParams.okpd2 != '') {

                const okpd2Codes = autoSearchParams.okpd2.split(/;| /).filter(code => code !== ''); // Разделение строки на отдельные коды и фильтрация пустых элементов
                const regexQuery = okpd2Codes.map(code => ({
                    'lots.lot.lotData.lotItems.lotItem.okpd2.code': { $regex: '^' + code, $options: 'i' }
                }));

                query.push({
                    $or: regexQuery
                });

            }

            if (autoSearchParams.methodDeterminingSupplier !== '') {
                const methodDeterminingSupplierValues = autoSearchParams.methodDeterminingSupplier.split(/;| /).filter(code => code !== '');

                const regexQuery = methodDeterminingSupplierValues.map(value => ({
                    $or: [
                        { 'purchaseCodeName': { $regex: value, $options: 'i' } },
                        { "commonInfo.placingWay.name": { $regex: value, $options: 'i' } }
                    ]
                }));

                query.push({
                    $or: regexQuery
                });

            }

            if (autoSearchParams.fz != '') {
                const resFz = autoSearchParams.fz.split(' ')

                const res = []

                for (let i = 0; i < resFz.length; i++) {
                    const fz = resFz[i];

                    if (fz != '') {
                        res.push({
                            fz: { $regex: fz.trim(), $options: 'i' }
                        })
                    }
                }

                query.push({
                    $or: [
                        ...res
                    ]
                })
            }

            query.push({
                $or: [
                    { 'registrationNumber': { $nin: readed.map((tdnr) => tdnr.reg_num) } },
                    { 'commonInfo.purchaseNumber': { $nin: readed.map((tdnr) => tdnr.reg_num) } },
                ]
            })

            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            let sortParams

            if (sort == 'publicDate') {
                sortParams = { customDate: -1 }
            }
            if (sort == 'customDate') {
                sortParams = { customDate: -1 }
            }
            if (sort == 'Price') {
                sortParams = {
                    $or: [
                        { 'notificationInfo.contractConditionsInfo.maxPriceInfo.maxPrice': -1 },
                        { 'lots.lot.lotData.initialSum': -1 }
                    ]
                }
            }
            if (sort == 'FinishDate') {
                sortParams = {
                    $or: [
                        { 'submissionCloseDateTime': -1 },
                        { 'notificationInfo.procedureInfo.collectingInfo.endDT': -1 }
                    ]
                }
            }
            if (sort == 'publicDateReverse') {
                sortParams = { customDate: 1 }
            }
            if (sort == 'customDateReverse') {
                sortParams = { customDate: 1 }
            }
            if (sort == 'PriceReverse') {
                sortParams = {
                    $or: [
                        { 'notificationInfo.contractConditionsInfo.maxPriceInfo.maxPrice': 1 },
                        { 'lots.lot.lotData.initialSum': 1 }
                    ]
                }
            }
            if (sort == 'FinishDateReverse') {
                sortParams = {
                    $or: [
                        { 'submissionCloseDateTime': 1 },
                        { 'notificationInfo.procedureInfo.collectingInfo.endDT': 1 }
                    ]
                }
            }

            const result = await collection.find({ $and: query }).skip(start).limit(limit).sort(sortParams).toArray();


            return res.json({message: result, count: countNewTenders})




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
        // try {

        //     const id = req.user.id
        //     const autoSearchId = req.params.id

        //     const page = req.query.page

        //     const limit = 8

        //     const candidate = await AutoSearch.findOne({
        //         where: {
        //             id: autoSearchId,
        //         }
        //     })
        //     if (!candidate) return res.status(400).json({ message: 'Автопоиск не существует!' })


        //     const tenders = await AutoSearchResult.findAll({
        //         where: {
        //             user_id: id,
        //             autosearch_id: autoSearchId,
        //             isRead: true
        //         },
        //         limit: limit,
        //         offset: (page - 1) * limit
        //     })

        //     const result = []

        //     const client = await connectDB()
        //     const db = client.db(process.env.MONGO_DB_NAME)
        //     const collection = db.collection('tender')

        //     for (let i = 0; i < tenders.length; i++) {
        //         const element = tenders[i];

        //         const tender = await collection.findOne({
        //             $or: [
        //                 { "commonInfo.purchaseNumber": String(element.reg_num) },
        //                 { registrationNumber: String(element.reg_num) }
        //             ]
        //         })

        //         if (tender == null) continue

        //         result.push(tender)
        //     }

        //     return res.json({ message: result })


        // } catch (error) {
        //     console.log(error);
        //     return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        // }
    }


    async isReadMark(req, res) {
        try {

            const id = req.user.id
            const regNum = req.params.id


            const createMark = await isReadTenders.create({
                user_id: id,
                reg_num: regNum,
            })

            return res.json({ message: 'Отмечено как прочитанное!' })



        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }

}

export default new AutoSearchController()