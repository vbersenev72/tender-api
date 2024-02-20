import { Router } from "express";
import lkController from "../controllers/lk.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const lkRouter = Router()

lkRouter.post('/mytenders', authMiddleware, lkController.saveInMyTenders)
lkRouter.delete('/mytenders/:id', authMiddleware, lkController.deleteFromMyTenders)
lkRouter.get('/mytenders/:page', authMiddleware, lkController.getMyTenders)
lkRouter.post('/changepass', authMiddleware, lkController.changePassword)
lkRouter.get('/profile', authMiddleware, lkController.getProfileInfo)
lkRouter.post('/profile', authMiddleware, lkController.editProlife)
lkRouter.post('/resetpass', lkController.resetPass)



export default lkRouter