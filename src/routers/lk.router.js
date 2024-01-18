import { Router } from "express";
import lkController from "../controllers/lk.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const lkRouter = Router()

lkRouter.post('/mytenders', authMiddleware, lkController.saveInMyTenders)
lkRouter.delete('/mytenders/:id', authMiddleware, lkController.deleteFromMyTenders)
lkRouter.get('/mytenders/:page', authMiddleware, lkController.getMyTenders)

export default lkRouter