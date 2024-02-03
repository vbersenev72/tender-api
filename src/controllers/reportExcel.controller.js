import db from '../models/index.js'

const ReportExcel = db.reportExcel

class ReportExcelController {

    async createReport(req, res) {
        try {

            const id = req.user.id
            const {tenders, } = req.body

        } catch (error) {
            console.log(error);
            return res.status(400).json({message: 'Ошибка создания отчёта'})
        }
    }

    async deleteReport(req, res) {
        try {

            const id = req.user.id
            const reportId = req.params.id


            
        } catch (error) {
            console.log(error);
            return res.status(400).json({message: 'Ошибка удаления отчёта'})
        }
    }
}