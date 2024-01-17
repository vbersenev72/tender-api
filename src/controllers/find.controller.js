
import connectDB from "../../db/mongoCLient.js";
import { config } from "dotenv";

config()

class FindController {
    async findByTags(req, res) {
        try {

            const { limit, tags } = req.body

            const start = limit.split('-').map(Number)[0]
            const end = limit.split('-').map(Number)[1]

            console.log(process.env.MONGO_DB_NAME);

            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            let result
            let count

            if (JSON.stringify(tags) == JSON.stringify("")) {
                result = await collection.find().skip(start).limit(end - start + 1).toArray();
            } else {
                result = await collection.find({ $text: { $search: tags } }, { score: { $meta: "textScore" } }).skip(start).limit(end - start + 1).toArray();
            }



            client.close()

            console.log(result)

            return res.json({ message: result, })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'error', error })
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

            const purchase = await purchaseProtocol.find({ fz: "fz223", "purchaseInfo.purchaseNoticeNumber": id }).toArray()



            if (!tender) return res.status(400).json({ message: 'not found' })

            return res.json({ purchaseProtocol: purchase, tender: [tender], explanation: [] })

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
                    { registrationNumber: id }
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