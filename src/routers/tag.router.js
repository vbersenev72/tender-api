import { Router } from "express";
import tagController from "../controllers/tag.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const tagRouter = Router()

tagRouter.post('/create', authMiddleware, tagController.createTag)
tagRouter.post('/edit', authMiddleware, tagController.editTag)
tagRouter.delete('/delete/:id', authMiddleware, tagController.deleteTag)
tagRouter.get('/getall', authMiddleware, tagController.getAllTags)

tagRouter.post('/addtotender', authMiddleware, tagController.addTagToTender)
tagRouter.post('/deletefromtender', authMiddleware, tagController.deleteTagFromTender)
tagRouter.post('/gettenders', authMiddleware, tagController.getTendersByTag)
tagRouter.post('/getcounttenders', authMiddleware, tagController.getCountTendersByTag)



export default tagRouter