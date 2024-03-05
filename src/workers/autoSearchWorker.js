import connectDB from "../../db/mongoCLient.js";
import db from "../models/index.js";

const autoSearchResult = db.autoSearchResult
const autoSearch = db.autoSearch

export const AutoSearch = async () => {
    try {

        const autoSearchList = await autoSearch.findAll()

        for (let i = 0; i < autoSearchList.length; i++) {
            const autoSearchParams = autoSearchList[i];

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
                    { $text: { $search: tags } }
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

            function getTime24HoursAgo() {
                const twentyFourHoursAgo = new Date();
                twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
                return twentyFourHoursAgo;
            }// для варианта отсутствия поля last_search
            const time24HoursAgo = getTime24HoursAgo();

            // Добавляем в запрос проверку на дату появления тендера (Она должна быть между autoSearchParams.last_search и текущей датой)
            if (autoSearchParams.last_search != '') {
                query.push({
                    $and: [
                        {
                            $or: [
                                { 'customDate': { $gte: new Date(autoSearchParams.last_search).toISOString() } },
                                { 'createDateTime': { $gte: new Date(autoSearchParams.last_search).toISOString() } }
                            ]
                        },
                        {
                            $or: [
                                { 'customDate': { $lte: new Date().toISOString() } },
                                { 'createDateTime': { $lte: new Date().toISOString() } }
                            ]
                        }
                    ]
                })
            } else {
                query.push({
                    $and: [
                        {
                            $or: [
                                { 'customDate': { $gte: new Date(time24HoursAgo).toISOString() } },
                                { 'createDateTime': { $gte: new Date(time24HoursAgo).toISOString() } }
                            ]
                        },
                        {
                            $or: [
                                { 'customDate': { $lte: new Date().toISOString() } },
                                { 'createDateTime': { $lte: new Date().toISOString() } }
                            ]
                        }
                    ]
                })
            }

            console.log(JSON.stringify(query));


            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')


            const result = await collection.find({ $and: query }).limit(20).toArray();

            const fixedLastSearchTime = await autoSearch.update({
                last_search: String(new Date())
            },
                {
                    where: {
                        id: autoSearchParams.id
                    }
                }
            )


            for (let i = 0; i < result.length; i++) {
                const tender = result[i];

                const regNum = tender.registrationNumber ? tender.registrationNumber : tender.commonInfo.purchaseNumber

                const createAutoSearchResult = await autoSearchResult.create({
                    user_id: autoSearchParams.user_id,
                    autosearch_id: autoSearchParams.id,
                    reg_num: regNum,
                })

            }

        }

        console.log('цикл автопоиска завершен!', new Date());

    } catch (error) {
        console.log(error);
    }
}
