import { Router } from "express";
import reportExcelController from "../controllers/reportExcel.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const reportExcelRouter = Router()

reportExcelRouter.post('/create', authMiddleware, reportExcelController.createReport)

reportExcelRouter.post('/createautosearchreport', authMiddleware, reportExcelController.createReportForAutoSearch)
reportExcelRouter.post('/createtagsreport', authMiddleware, reportExcelController.createReportForTags)
reportExcelRouter.post('/createmytendersreport', authMiddleware, reportExcelController.createReportForMytenders)

reportExcelRouter.delete('/delete/:id', authMiddleware, reportExcelController.deleteReport)
reportExcelRouter.get('/', authMiddleware, reportExcelController.getAllByUser)


export default reportExcelRouter