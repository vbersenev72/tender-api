import db from '../models/index.js'
import connectDB from '../../db/mongoCLient.js'
import { config } from 'dotenv'
import ExcelJs from 'exceljs'
import path from 'path'

config()

const ReportExcel = db.reportExcel
const AutoSearchResult = db.autoSearchResult
const MyTenders = db.myTenders
const TendersData = db.tendersData

const getDate = () => {

    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const formattedDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;

    return formattedDate
}


class ReportExcelController {

    async createReport(req, res) {
        try {

            const id = req.user.id
            const { tenders, } = req.body

            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            const result = []

            for (let i = 0; i < tenders.length; i++) {
                const regNum = tenders[i];

                const tender = await collection.findOne({
                    $or: [
                        { "commonInfo.purchaseNumber": regNum },
                        { registrationNumber: regNum }
                    ]
                })

                result.push(tender)

            }

            const date = getDate()

            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('Отчёт ' + String(date));

            worksheet.getRow(1).values = [
                'Номер',
                'Объем закупки',
                'Начальная цена',
                'Регион',
                'Дата начала',
                'Дата окончания',
                'Заказчик',
                'Дата публикации',
                'Тип заявки'
            ];


            for (let i = 0; i < result.length; i++) {
                const tenderData = result[i];

                console.log(tenderData);

                if (tenderData.fz == 'fz44') {
                    const row = worksheet.addRow([
                        tenderData?.commonInfo?.purchaseNumber,
                        tenderData?.purchaseResponsibleInfo?.responsibleOrgInfo?.fullName,
                        tenderData?.notificationInfo?.contractConditionsInfo?.maxPriceInfo?.maxPrice,
                        tenderData?.customer?.mainInfo?.region,
                        tenderData?.notificationInfo?.procedureInfo?.collectingInfo?.startDT,
                        tenderData?.notificationInfo?.procedureInfo?.collectingInfo?.endDT,
                        tenderData?.purchaseResponsibleInfo?.responsibleOrgInfo?.fullName,
                        tenderData?.commonInfo?.publishDTInEIS,
                        tenderData?.commonInfo?.purchaseObjectInfo
                    ]);

                    worksheet.getCell(`E${i + 2}`).numFmt = 'dd.mm.yyyy';
                    worksheet.getCell(`F${i + 2}`).numFmt = 'dd.mm.yyyy';
                }

                if (tenderData.fz == 'fz223') {
                    const row = worksheet.addRow([
                        tenderData?.registrationNumber,
                        tenderData?.name,
                        tenderData?.lots?.lot?.lotData?.initialSum,
                        tenderData?.customer?.mainInfo?.region,
                        tenderData?.publicationDateTime,
                        tenderData?.submissionCloseDateTime,
                        tenderData?.customer.mainInfo?.fullName,
                        tenderData?.publicationDateTime,
                        tenderData?.purchaseCodeName

                    ]);

                    worksheet.getCell(`E${i + 2}`).numFmt = 'dd.mm.yyyy';
                    worksheet.getCell(`F${i + 2}`).numFmt = 'dd.mm.yyyy';
                }

            }

            const name = `Excel-${getDate()}-${new Date().getTime()}.xlsx`
            const filePath = `./files/${name}`

            workbook.xlsx.writeFile(filePath)
                .then(() => {
                    console.log('Файл успешно создан!');
                })
                .catch((error) => {
                    console.error('Произошла ошибка при создании файла:', error);
                });


            const createReport = await ReportExcel.create({
                user_id: id,
                link: `/${name}`
            })

            return res.json({ message: 'Отчет готов!', path: `/${name}` })





        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Ошибка создания отчёта' })
        }
    }

    async createReportForTags(req, res) {
        try {

            const id = req.user.id
            const {tagId} = req.body

            const TagsResults = await TendersData.findAll({
                where: {
                    user_id: id,
                    tag_id: tagId
                }
            })

            const tenders = TagsResults.map((tender) => tender.reg_num)

            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            const result = []

            for (let i = 0; i < tenders.length; i++) {
                const regNum = tenders[i];

                const tender = await collection.findOne({
                    $or: [
                        { "commonInfo.purchaseNumber": regNum },
                        { registrationNumber: regNum }
                    ]
                })

                result.push(tender)

            }

            const date = getDate()

            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('Отчёт ' + String(date));

            worksheet.getRow(1).values = [
                'Номер',
                'Объем закупки',
                'Начальная цена',
                'Регион',
                'Дата начала',
                'Дата окончания',
                'Заказчик',
                'Дата публикации',
                'Тип заявки'
            ];


            for (let i = 0; i < result.length; i++) {
                const tenderData = result[i];

                console.log(tenderData);

                if (tenderData.fz == 'fz44') {
                    const row = worksheet.addRow([
                        tenderData?.commonInfo?.purchaseNumber,
                        tenderData?.purchaseResponsibleInfo?.responsibleOrgInfo?.fullName,
                        tenderData?.notificationInfo?.contractConditionsInfo?.maxPriceInfo?.maxPrice,
                        tenderData?.customer?.mainInfo?.region,
                        tenderData?.notificationInfo?.procedureInfo?.collectingInfo?.startDT,
                        tenderData?.notificationInfo?.procedureInfo?.collectingInfo?.endDT,
                        tenderData?.purchaseResponsibleInfo?.responsibleOrgInfo?.fullName,
                        tenderData?.commonInfo?.publishDTInEIS,
                        tenderData?.commonInfo?.purchaseObjectInfo
                    ]);

                    worksheet.getCell(`E${i + 2}`).numFmt = 'dd.mm.yyyy';
                    worksheet.getCell(`F${i + 2}`).numFmt = 'dd.mm.yyyy';
                }

                if (tenderData.fz == 'fz223') {
                    const row = worksheet.addRow([
                        tenderData?.registrationNumber,
                        tenderData?.name,
                        tenderData?.lots?.lot?.lotData?.initialSum,
                        tenderData?.customer?.mainInfo?.region,
                        tenderData?.publicationDateTime,
                        tenderData?.submissionCloseDateTime,
                        tenderData?.customer.mainInfo?.fullName,
                        tenderData?.publicationDateTime,
                        tenderData?.purchaseCodeName

                    ]);

                    worksheet.getCell(`E${i + 2}`).numFmt = 'dd.mm.yyyy';
                    worksheet.getCell(`F${i + 2}`).numFmt = 'dd.mm.yyyy';
                }

            }

            const name = `Excel-${getDate()}-${new Date().getTime()}.xlsx`
            const filePath = `./files/${name}`

            workbook.xlsx.writeFile(filePath)
                .then(() => {
                    console.log('Файл успешно создан!');
                })
                .catch((error) => {
                    console.error('Произошла ошибка при создании файла:', error);
                });


            const createReport = await ReportExcel.create({
                user_id: id,
                link: `/${name}`
            })

            return res.json({ message: 'Отчет готов!', path: `/${name}` })
            
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Ошибка создания отчёта' }) 
        }
    }

    async createReportForMytenders(req, res) {
        try {

            const id = req.user.id

            const findMyTenders = await MyTenders.findAll({
                where: {
                    user_id: id
                }
            })

            const tenders = findMyTenders.map((tender) => tender.reg_num)
            
            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            const result = []

            for (let i = 0; i < tenders.length; i++) {
                const regNum = tenders[i];

                const tender = await collection.findOne({
                    $or: [
                        { "commonInfo.purchaseNumber": regNum },
                        { registrationNumber: regNum }
                    ]
                })

                result.push(tender)

            }

            const date = getDate()

            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('Отчёт ' + String(date));

            worksheet.getRow(1).values = [
                'Номер',
                'Объем закупки',
                'Начальная цена',
                'Регион',
                'Дата начала',
                'Дата окончания',
                'Заказчик',
                'Дата публикации',
                'Тип заявки'
            ];


            for (let i = 0; i < result.length; i++) {
                const tenderData = result[i];

                console.log(tenderData);

                if (tenderData.fz == 'fz44') {
                    const row = worksheet.addRow([
                        tenderData?.commonInfo?.purchaseNumber,
                        tenderData?.purchaseResponsibleInfo?.responsibleOrgInfo?.fullName,
                        tenderData?.notificationInfo?.contractConditionsInfo?.maxPriceInfo?.maxPrice,
                        tenderData?.customer?.mainInfo?.region,
                        tenderData?.notificationInfo?.procedureInfo?.collectingInfo?.startDT,
                        tenderData?.notificationInfo?.procedureInfo?.collectingInfo?.endDT,
                        tenderData?.purchaseResponsibleInfo?.responsibleOrgInfo?.fullName,
                        tenderData?.commonInfo?.publishDTInEIS,
                        tenderData?.commonInfo?.purchaseObjectInfo
                    ]);

                    worksheet.getCell(`E${i + 2}`).numFmt = 'dd.mm.yyyy';
                    worksheet.getCell(`F${i + 2}`).numFmt = 'dd.mm.yyyy';
                }

                if (tenderData.fz == 'fz223') {
                    const row = worksheet.addRow([
                        tenderData?.registrationNumber,
                        tenderData?.name,
                        tenderData?.lots?.lot?.lotData?.initialSum,
                        tenderData?.customer?.mainInfo?.region,
                        tenderData?.publicationDateTime,
                        tenderData?.submissionCloseDateTime,
                        tenderData?.customer.mainInfo?.fullName,
                        tenderData?.publicationDateTime,
                        tenderData?.purchaseCodeName

                    ]);

                    worksheet.getCell(`E${i + 2}`).numFmt = 'dd.mm.yyyy';
                    worksheet.getCell(`F${i + 2}`).numFmt = 'dd.mm.yyyy';
                }

            }

            const name = `Excel-${getDate()}-${new Date().getTime()}.xlsx`
            const filePath = `./files/${name}`

            workbook.xlsx.writeFile(filePath)
                .then(() => {
                    console.log('Файл успешно создан!');
                })
                .catch((error) => {
                    console.error('Произошла ошибка при создании файла:', error);
                });


            const createReport = await ReportExcel.create({
                user_id: id,
                link: `/${name}`
            })

            return res.json({ message: 'Отчет готов!', path: `/${name}` })



        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Ошибка создания отчёта' })
        }
    }


    async createReportForAutoSearch(req, res) {
        try {

            const id = req.user.id
            const { autoSearchId } = req.body

            const findResults = await AutoSearchResult.findAll({
                where: {
                    user_id: id,
                    autosearch_id: autoSearchId
                }
            })

            const tenders = findResults.map((tender) => tender.reg_num)

            const client = await connectDB()
            const db = client.db(process.env.MONGO_DB_NAME)
            const collection = db.collection('tender')

            const result = []

            for (let i = 0; i < tenders.length; i++) {
                const regNum = tenders[i];

                const tender = await collection.findOne({
                    $or: [
                        { "commonInfo.purchaseNumber": regNum },
                        { registrationNumber: regNum }
                    ]
                })

                result.push(tender)

            }

            const date = getDate()

            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('Отчёт ' + String(date));

            worksheet.getRow(1).values = [
                'Номер',
                'Объем закупки',
                'Начальная цена',
                'Регион',
                'Дата начала',
                'Дата окончания',
                'Заказчик',
                'Дата публикации',
                'Тип заявки'
            ];


            for (let i = 0; i < result.length; i++) {
                const tenderData = result[i];

                console.log(tenderData);

                if (tenderData.fz == 'fz44') {
                    const row = worksheet.addRow([
                        tenderData?.commonInfo?.purchaseNumber,
                        tenderData?.purchaseResponsibleInfo?.responsibleOrgInfo?.fullName,
                        tenderData?.notificationInfo?.contractConditionsInfo?.maxPriceInfo?.maxPrice,
                        tenderData?.customer?.mainInfo?.region,
                        tenderData?.notificationInfo?.procedureInfo?.collectingInfo?.startDT,
                        tenderData?.notificationInfo?.procedureInfo?.collectingInfo?.endDT,
                        tenderData?.purchaseResponsibleInfo?.responsibleOrgInfo?.fullName,
                        tenderData?.commonInfo?.publishDTInEIS,
                        tenderData?.commonInfo?.purchaseObjectInfo
                    ]);

                    worksheet.getCell(`E${i + 2}`).numFmt = 'dd.mm.yyyy';
                    worksheet.getCell(`F${i + 2}`).numFmt = 'dd.mm.yyyy';
                }

                if (tenderData.fz == 'fz223') {
                    const row = worksheet.addRow([
                        tenderData?.registrationNumber,
                        tenderData?.name,
                        tenderData?.lots?.lot?.lotData?.initialSum,
                        tenderData?.customer?.mainInfo?.region,
                        tenderData?.publicationDateTime,
                        tenderData?.submissionCloseDateTime,
                        tenderData?.customer.mainInfo?.fullName,
                        tenderData?.publicationDateTime,
                        tenderData?.purchaseCodeName

                    ]);

                    worksheet.getCell(`E${i + 2}`).numFmt = 'dd.mm.yyyy';
                    worksheet.getCell(`F${i + 2}`).numFmt = 'dd.mm.yyyy';
                }

            }

            const name = `Excel-${getDate()}-${new Date().getTime()}.xlsx`
            const filePath = `./files/${name}`

            workbook.xlsx.writeFile(filePath)
                .then(() => {
                    console.log('Файл успешно создан!');
                })
                .catch((error) => {
                    console.error('Произошла ошибка при создании файла:', error);
                });


            const createReport = await ReportExcel.create({
                user_id: id,
                link: `/${name}`
            })

            return res.json({ message: 'Отчет готов!', path: `/${name}` })


        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Ошибка создания отчёта' })
        }
    }

    async deleteReport(req, res) {
        try {

            const id = req.user.id
            const reportId = req.params.id

            const candidate = await ReportExcel.findOne({
                where: {
                    id: reportId,
                    user_id: id
                }
            })

            if (!candidate) return res.status(400).json({ message: 'Отчет не найден' })

            const destroyReport = await ReportExcel.destroy({
                where: {
                    id: reportId,
                    user_id: id
                }
            })


            return res.json({ message: 'Отчет удален!' })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Ошибка удаления отчёта' })
        }
    }



    async getAllByUser(req, res) {
        try {

            const id = req.user.id

            const reports = await ReportExcel.findAll({
                where: {
                    user_id: id
                }
            })


            return res.json({ message: reports })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Ошибка удаления отчёта' })
        }
    }
}


export default new ReportExcelController()