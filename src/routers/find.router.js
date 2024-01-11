import { Router } from "express";
import findController from "../controllers/find.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const findRouter = Router()

findRouter.post('/find', findController.findByTags)
findRouter.post('/advancedfind223', findController.advancedFindByTagsFz223)
findRouter.post('/advancedfind44', authMiddleware, findController.advancedFindByTagsFz44)
findRouter.get('/:id', findController.findByRegNumber)


export default findRouter