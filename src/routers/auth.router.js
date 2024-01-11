import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.post('/auth', authMiddleware, authController.auth)


export default authRouter