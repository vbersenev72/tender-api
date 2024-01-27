class AutoSearchController {
    async createAutoSearch(req, res) {
        try {

            let {
                page,
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



        } catch (error) {
            return res.status(400).json({message: 'Произошла ошибка, попробуйте позже'})
        }
    }
}