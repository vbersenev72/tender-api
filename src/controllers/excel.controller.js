class ExcelController {
    async createReport(req, res) {
        try {

            const id = req.user.id
            const {tenders, } = req.body

        } catch (error) {
            console.log(error);
            return res.status(400).json({message: 'Ошибка создания отчёта'})
        }
    }
}