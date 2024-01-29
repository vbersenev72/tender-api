import { Router } from "express";
import findController from "../controllers/find.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import autoSearchController from "../controllers/autoSearch.controller.js";


const autoSearchRouter = Router()

autoSearchRouter.post('/create', authMiddleware, autoSearchController.createAutoSearch)
autoSearchRouter.post('/edit', authMiddleware, autoSearchController.editAutoSearch)
autoSearchRouter.delete('/delete/:id', authMiddleware, autoSearchController.deleteAutoSearch)
autoSearchRouter.get('/:id', authMiddleware, autoSearchController.getAutoSearch)
autoSearchRouter.get('/autosearches/all', authMiddleware, autoSearchController.getAllAutoSearch)
autoSearchRouter.get('/getresult/:id', authMiddleware, autoSearchController.getResultAutoSearch)
autoSearchRouter.get('/count/:id', authMiddleware, autoSearchController.getCountResultAutoSearch)
autoSearchRouter.get('/getresultisread/:id', authMiddleware, autoSearchController.getResultIsRead)
autoSearchRouter.post('/read', authMiddleware, autoSearchController.isReadMark)


export default autoSearchRouter