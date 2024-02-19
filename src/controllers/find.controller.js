
import connectDB from "../../db/mongoCLient.js";
import { config } from "dotenv";

config()

class FindController {
    async findByTags(req, res) {
        try {

            const { limit, page, tags } = req.body

            let start = Number(page) * limit - 1

            console.log(process.env.MONGO_DB_NAME);

            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            let result
            let count

            if (JSON.stringify(tags) == JSON.stringify("")) {
                result = await collection.find().skip(start).limit(limit).sort({ customDate: -1 }).toArray();
            } else {
                result = await collection.find({ $text: { $search: tags } }, { score: { $meta: "text Score" } }).skip(start).limit(limit).sort({ customDate: -1 }).toArray();
            }



            client.close()

            console.log(result)

            return res.json({ message: result, })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'error', error })
        }
    }


    async advancedFind(req, res) {
        try {

            let {
                page,
                limit,

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
                priceFrom, priceTo, enableNoPrice,
                purchaseStage, //
                methodDeterminingSupplier, //
                source, enableSource,
                okpd2

            } = req.body

            let start = Number(page) * limit - 1

            const query = [
                // {
                //     fz: 'fz44'
                // }
            ]

            if (tags == "" && stopTags != "") {
                const regexArray = stopTags.split(' ').map(word => new RegExp(word, 'i'));

                query.push({
                    'commonInfo.purchaseObjectInfo': { $not: { $in: regexArray } },
                    name: { $not: { $in: regexArray } }
                })


            }

            if (tags != "" && stopTags == "") {

                query.push(
                    {
                        $or: [
                            { "commonInfo.purchaseObjectInfo": { $in: tags.split(' ').map(word => new RegExp(word, 'i')), } },
                            { name: { $in: tags.split(' ').map(word => new RegExp(word, 'i')), } }
                        ]
                    },
                )

            }

            if (tags != "" && stopTags != "") {
                const regexArray = stopTags.split(' ').map(word => new RegExp(word, 'i'));

                query.push(
                    {
                        $or: [
                            { "commonInfo.purchaseObjectInfo": { $in: tags.split(' ').map(word => new RegExp(word, 'i')), } },
                            { name: { $in: tags.split(' ').map(word => new RegExp(word, 'i')), } }
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

            if (publicDateFrom == '' && publicDateTo != '') {

                query.push({
                    $or: [
                        { 'publicationDateTime': { $lte: new Date(publicDateTo).toISOString() } },
                        { 'commonInfo.publishDTInEIS': { $lte: new Date(publicDateTo).toISOString() } }
                    ]
                })
            }

            if (publicDateFrom != '' && publicDateTo == '') {

                query.push({
                    $or: [
                        { 'publicationDateTime': { $gte: new Date(publicDateFrom).toISOString() } },
                        { 'commonInfo.publishDTInEIS': { $gte: new Date(publicDateFrom).toISOString() } }
                    ]
                })

            }

            if (publicDateFrom != '' && publicDateTo != '') {

                query.push({
                    $and: [
                        {
                            $or: [
                                { 'publicationDateTime': { $gte: new Date(publicDateFrom).toISOString() } },
                                { 'commonInfo.publishDTInEIS': { $gte: new Date(publicDateFrom).toISOString() } }
                            ]
                        },
                        {
                            $or: [
                                { 'publicationDateTime': { $lte: new Date(publicDateTo).toISOString() } },
                                { 'commonInfo.publishDTInEIS': { $lte: new Date(publicDateTo).toISOString() } }
                            ]
                        }

                    ]
                })

            }

            if (startDateFrom != '' && startDateTo == '') {
                query.push({
                    $or: [
                        { 'publicationDateTime': { $gte: new Date(startDateFrom).toISOString() } },
                        { 'notificationInfo.procedureInfo.collectingInfo.startDT': { $gte: new Date(startDateFrom).toISOString() } }
                    ]
                })
            }

            if (startDateFrom == '' && startDateTo != '') {
                query.push({
                    $or: [
                        { 'publicationDateTime': { $lte: new Date(startDateTo).toISOString() } },
                        { 'notificationInfo.procedureInfo.collectingInfo.startDT': { $lte: new Date(startDateTo).toISOString() } }
                    ]
                })
            }

            if (startDateFrom != '' && startDateTo != '') {
                query.push({
                    $and: [
                        {
                            $or: [
                                { 'publicationDateTime': { $lte: new Date(startDateTo).toISOString() } },
                                { 'notificationInfo.procedureInfo.collectingInfo.startDT': { $lte: new Date(startDateTo).toISOString() } }
                            ],
                            $or: [
                                { 'publicationDateTime': { $gte: new Date(startDateFrom).toISOString() } },
                                { 'notificationInfo.procedureInfo.collectingInfo.startDT': { $gte: new Date(startDateFrom).toISOString() } }
                            ]
                        }
                    ]
                })
            }


            if (endDateFrom != '' && endDateTo == '') {
                query.push({
                    $or: [
                        { 'submissionCloseDateTime': { $gte: new Date(endDateFrom).toISOString() } },
                        { 'notificationInfo.procedureInfo.collectingInfo.endDT': { $gte: new Date(endDateFrom).toISOString() } }
                    ]
                })
            }

            if (endDateFrom == '' && endDateTo != '') {
                query.push({
                    $or: [
                        { 'submissionCloseDateTime': { $lte: new Date(endDateTo).toISOString() } },
                        { 'notificationInfo.procedureInfo.collectingInfo.endDT': { $lte: new Date(endDateTo).toISOString() } }
                    ]
                })
            }

            if (endDateFrom != '' && endDateTo != '') {
                query.push({
                    $and: [
                        {
                            $or: [
                                { 'submissionCloseDateTime': { $gte: new Date(endDateFrom).toISOString() } },
                                { 'notificationInfo.procedureInfo.collectingInfo.endDT': { $gte: new Date(endDateFrom).toISOString() } }
                            ],
                        },
                        {
                            $or: [
                                { 'submissionCloseDateTime': { $lte: new Date(endDateTo).toISOString() } },
                                { 'notificationInfo.procedureInfo.collectingInfo.endDT': { $lte: new Date(endDateTo).toISOString() } }
                            ]
                        }
                    ]

                })
            }


            if (region != '') {

                const regions = region.split(/;| /).filter(value => value !== '');

                const regexQueryFor223 = regions.map(value => ({
                    'customer.mainInfo.region': { $regex: value, $options: 'i' }
                }));

                const regexQueryFor44 = regions.map(value => ({
                    'purchaseResponsibleInfo.responsibleOrgInfo.postAddress': { $regex: value, $options: 'i' }
                }));

                query.push({
                    $or: [...regexQueryFor223, ...regexQueryFor44]
                });

                // разраб парсера положил хуй на поле региона у тендеров с 44 ФЗ - как только исправит нужно добавить это поле сюды  (есть)
            }

            if (tenderNum != '') {
                const tenderNums = tenderNum.split(' ')

                query.push({
                    $or: [
                        { 'registrationNumber': { $in: tenderNums } },
                        { 'commonInfo.purchaseNumber': { $in: tenderNums } },
                    ]
                })

            }

            if (customerName != "") {

                if (String(stopCustomerName) == 'true') {
                    query.push({
                        'customer.mainInfo.fullName': { $not: { $regex: customerName, $options: 'i' } },
                        'purchaseResponsibleInfo.responsibleOrgInfo.fullName': { $not: { $regex: customerName, $options: 'i' } }
                    })
                } else {
                    query.push({
                        $or: [
                            { 'customer.mainInfo.fullName': { $regex: customerName, $options: 'i' } },
                            { 'purchaseResponsibleInfo.responsibleOrgInfo.fullName': { $regex: customerName, $options: 'i' } }
                        ]
                    })
                }

            }

            if (inn != "") {
                const inns = inn.split(' ')

                query.push({
                    $or: [
                        { 'customer.mainInfo.inn': { $in: inns } },
                        { 'purchaseResponsibleInfo.responsibleOrgInfo.INN': { $in: inns } },
                    ]
                })
            }

            if (priceFrom == "" && priceTo != "") {
                query.push({
                    $or: [
                        { 'notificationInfo.contractConditionsInfo.maxPriceInfo.maxPrice': { $lte: priceTo } },
                        { 'lots.lot.lotData.initialSum': { $lte: priceTo } }
                    ]
                })
            }

            if (priceFrom != "" && priceTo == "") {
                query.push({
                    $or: [
                        { 'notificationInfo.contractConditionsInfo.maxPriceInfo.maxPrice': { $gte: priceFrom } },
                        { 'lots.lot.lotData.initialSum': { $gte: priceFrom } }
                    ]
                })
            }

            if (priceFrom != "" && priceTo != "") {
                query.push({
                    $and: [
                        {
                            $or: [
                                { 'notificationInfo.contractConditionsInfo.maxPriceInfo.maxPrice': { $lte: priceTo } },
                                { 'lots.lot.lotData.initialSum': { $lte: priceTo } }
                            ]
                        },
                        {
                            $or: [
                                { 'notificationInfo.contractConditionsInfo.maxPriceInfo.maxPrice': { $gte: priceFrom } },
                                { 'lots.lot.lotData.initialSum': { $gte: priceFrom } }
                            ]
                        }
                    ]
                })
            }

            if (source != "") {
                query.push({
                    $or: [
                        { 'urlEIS': { $regex: source, $options: 'i' } },
                        { "commonInfo.href": { $regex: source, $options: 'i' } }
                    ]
                })
            }


            if (okpd2 !== '') {

                const okpd2Codes = okpd2.split(/;| /).filter(code => code !== ''); // Разделение строки на отдельные коды и фильтрация пустых элементов
                const regexQuery = okpd2Codes.map(code => ({
                    'lots.lot.lotData.lotItems.lotItem.okpd2.code': { $regex: '^' + code, $options: 'i' }
                }));

                query.push({
                    $or: regexQuery
                });

            }

            if (methodDeterminingSupplier !== '') {
                const methodDeterminingSupplierValues = methodDeterminingSupplier.split(/;| /).filter(code => code !== '');

                const regexQuery = methodDeterminingSupplierValues.map(value => ({
                    $or: [
                        { 'purchaseCodeName': { $regex: value, $options: 'i' } },
                        { "commonInfo.placingWay.name": { $regex: value, $options: 'i' } }
                    ]
                }));

                console.log(JSON.stringify(regexQuery));

                query.push({
                    $or: regexQuery
                });

            }

            ////////////////
            // if (purchaseStage !== '') {
            //     const stageValues = purchaseStage.split(/;| /).filter(code => code !== '');

            //     const regexQuery = stageValues.forEach((value) => {

            //         if (value.toLowerCase() == 'Подача заявок') {

            //             query.push({
            //                 $and: [
            //                     {
            //                         $or: [
            //                             { 'notificationInfo.procedureInfo.collectingInfo.startDT': { $lte: new Date().toISOString() }, },
            //                             { 'publicationDateTime': { $lte: new Date().toISOString() } },
            //                         ]
            //                     },
            //                     {
            //                         $or: [
            //                             { 'notificationInfo.procedureInfo.collectingInfo.endDT': { $gte: new Date().toISOString() } },
            //                             { 'submissionCloseDateTime': { $gte: new Date().toISOString() } },
            //                         ]
            //                     }
            //                 ]
            //             })
            //         }

            //         if (value.toLowerCase() == 'Работа комиссии') {
            //             query.push({
            //                 $or: [
            //                     { 'notificationInfo.procedureInfo.collectingInfo.endDT': { $lte: new Date() } },
            //                     { 'submissionCloseDateTime': { $lte: new Date().toISOString() } },
            //                 ]
            //             })
            //         }

            //         if (value.toLowerCase() == 'Закупка завершена') {
            //             query.push({
            //                 $or: [
            //                     { "notificationInfo.procedureInfo.summarizingDate": { $lte: new Date() } },
            //                     { "placingProcedure.summingupDateTime": { $lte: new Date() } },
            //                 ]
            //             })
            //         }
            //         if (value.toLowerCase() == 'Закупка приостановлена') {
            //             query.push({
            //                 $or: [
            //                     { "notificationInfo.procedureInfo.summarizingDate": { $lte: new Date() } },
            //                     { "placingProcedure.summingupDateTime": { $lte: new Date() } },
            //                 ]
            //             })
            //         }
            //         if (value.toLowerCase() == 'Закупка отменена') {
            //             query.push({
            //                 $or: [
            //                     { "notificationInfo.procedureInfo.summarizingDate": { $lte: new Date() } },
            //                     { 'placingProcedure.summingupDateTime': { $lte: new Date() } },
            //                 ]
            //             })
            //         }

            //     })

            // }



            if (fz != '') {
                const resFz = fz.split(' ')

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



            console.log(query);


            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            let result

            if (query.length > 0) {
                result = await collection.find({ $and: query }).skip(start).limit(limit).toArray();
            } else {
                result = await collection.find().skip(start).limit(limit).sort({ customDate: -1 }).toArray();
            }

            return res.json({ message: result })


        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }


    async advancedFindByTagsFz223(req, res) {
        try {

            let {
                limit,
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
                purchaseStage, // это пока не включено в индекс
                methodDeterminingSupplier, // это пока не включено в индекс
                source, enableSource,
                okpd2

            } = req.body

            const start = limit.split('-').map(Number)[0]
            const end = limit.split('-').map(Number)[1]

            const query = {
                // name: { $regex: tags, $not: { $regex: stopTags } },
                // publicationDateTime: { $gte: new Date(publicDateFrom).toISOString(), $lte: new Date(publicDateTo).toISOString() },
                // 'documentationDelivery.deliveryStartDateTime': { $gte: new Date(startDateFrom).toISOString(), $lte: new Date(startDateTo).toISOString() },
                // 'documentationDelivery.deliveryEndDateTime': { $gte: new Date(endDateFrom).toISOString(), $lte: new Date(endDateTo).toISOString() },
                // 'customer.mainInfo.region': { $regex: region },
                // // registrationNumber: tenderNum,
                // // 'customer.mainInfo.fullName': { $regex: customerName } ,
                // // 'customer.mainInfo.inn': inn,
                // 'lots.lot.lotData.initialSum': { $gte: priceFrom, $lte: priceTo },
                // // urlEIS: { $regex: source, $exists: enableSource },
                // // 'lots.lot.lotData.lotItems.lotItem.okpd2.name': okpd2,
            };

            if (!tags && stopTags) {
                query.name = { $not: { $regex: stopTags } }
            }
            if (tags && !stopTags) {
                query.name = { $regex: tags }
            }
            if (tags && stopTags) {
                query.name = { $regex: tags, $not: { $regex: stopTags } }
            }

            if (!publicDateFrom && publicDateTo) {
                query.publicDateTime = { $lte: new Date(publicDateTo).toISOString() }
            }
            if (publicDateFrom && !publicDateTo) {
                query.publicDateTime = { $gte: new Date(publicDateFrom).toISOString() }
            }
            if (publicDateFrom && publicDateTo) {
                query.publicationDateTime = { $gte: new Date(publicDateFrom).toISOString(), $lte: new Date(publicDateTo).toISOString() }
            }

            if (!startDateFrom && startDateTo) {
                query['documentationDelivery.deliveryStartDateTime'] = { $lte: new Date(startDateTo).toISOString() }
            }
            if (startDateFrom && !startDateTo) {
                query['documentationDelivery.deliveryStartDateTime'] = { $gte: new Date(startDateFrom).toISOString() }
            }
            if (startDateFrom && startDateTo) {
                query['documentationDelivery.deliveryStartDateTime'] = { $gte: new Date(startDateFrom).toISOString(), $lte: new Date(startDateTo).toISOString() }
            }

            if (!endDateFrom && endDateTo) {
                query['documentationDelivery.deliveryEndDateTime'] = { $lte: new Date(endDateTo).toISOString() }
            }
            if (endDateFrom && !endDateTo) {
                query['documentationDelivery.deliveryEndDateTime'] = { $gte: new Date(endDateFrom).toISOString() }
            }
            if (endDateFrom && endDateTo) {
                query['documentationDelivery.deliveryEndDateTime'] = { $gte: new Date(endDateFrom).toISOString(), $lte: new Date(endDateTo).toISOString() }
            }

            if (region) {
                query['customer.mainInfo.region'] = { $regex: region }
            }

            if (tenderNum) {
                query['registrationNumber'] = { $regex: tenderNum }
            }

            if (customerName) {
                query['customer.mainInfo.fullName'] = { $regex: customerName }
            }

            if (inn) {
                query['customer.mainInfo.inn'] = inn
            }

            if (!priceFrom && priceTo) {
                query['lots.lot.lotData.initialSum'] = { $gte: priceFrom }
            }
            if (priceFrom && !priceTo) {
                query['lots.lot.lotData.initialSum'] = { $lte: priceTo }
            }
            if (priceFrom && priceTo) {
                query['lots.lot.lotData.initialSum'] = { $gte: priceFrom, $lte: priceTo }
            }

            if (source) {
                query.urlEIS = { $regex: source }
            }

            if (okpd2) {
                query['lots.lot.lotData.lotItems.lotItem.okpd2.name'] = { $regex: okpd2 }
            }





            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')


            const result = await collection.find(query).skip(start).limit(end - start + 1).toArray();

            return res.json({ message: result })


        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'error', error })
        }
    }


    async advancedFindByTagsFz44(req, res) {
        try {



        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'error', error })
        }
    }


    async findByRegNumber(req, res) {
        try {

            const id = req.params.id

            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')
            const purchaseProtocol = db.collection('purchaseProtocol')

            const tender = await collection.findOne({
                $or: [
                    { "commonInfo.purchaseNumber": id },
                    { registrationNumber: id }
                ]
            })



            if (!tender) return res.status(400).json({ message: 'not found' })

            return res.json({ purchaseProtocol: [], tender: [tender], explanation: [] })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'error', error })
        }
    }


    async findByInnOrRegNumber(req, res) {
        try {


            const id = req.params.id

            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            const tender = await collection.findOne({
                $or: [
                    { "customer.mainInfo.inn": id },
                    { registrationNumber: id },
                    { 'commonInfo.purchaseNumber': id },
                    { 'purchaseResponsibleInfo.responsibleOrgInfo.INN': id }
                ]
            })



            if (!tender) return res.status(400).json({ message: 'not found' })

            return res.json({ tender: [tender] })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'error', error })
        }
    }
}



export default new FindController()