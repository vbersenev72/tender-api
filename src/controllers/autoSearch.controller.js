import db from '../models/index.js'

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

            if (candidate) return res.status(400).json({message: 'Автопоиск с таким именем уже существует!'})

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

            })

            return res.json({message: 'Автопоиск успешно задан!'})

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
                name,

                autoSearchId

            } = req.body

            const candidate = await AutoSearch.findOne({
                where: {
                    id: autoSearchId,
                }
            })

            if (!candidate) return res.status(400).json({message: 'Автопоиск не существует!'})

            const updateAutoSearch = await AutoSearch.update({
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

            }, {
                where: {
                    user_id: id,
                    id: autoSearchId
                }
            })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
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
            if (!candidate) return res.status(400).json({message: 'Автопоиск не существует!'})

            const deleteAutoSearch = await AutoSearch.destroy({
                where: {
                    user_id: id,
                    id: autoSearchId
                }
            })

            return res.json({message: 'Автопоиск удалён!'})

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

            if (!autoSearch) return res.status(400).json({message: 'Автопоиск не найден!'})

            return res.json({message: autoSearch})

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }


    async getResultAutoSearch(req, res) {
        try {

            const id = req.user.id
            const autoSearchId = req.params.id

            

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }

    async getCountResultAutoSearch(req, res) {
        try {

            const id = req.user.id
            const autoSearchId = req.params.id
            
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }


    async getResultIsRead(req, res) {
        try {

            const id = req.user.id
            const autoSearchId = req.params.page


        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }


    async isReadMark(req, res) {
        try {

            const id = req.user.id
            const autoSearchResultId = req.params.id


        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Произошла ошибка, попробуйте позже' })
        }
    }










}