import { Router } from "express";
import authRouter from "./auth.router.js";
import findRouter from "./find.router.js";
import lkRouter from "./lk.router.js";
import tagRouter from "./tag.router.js";

const router = Router()

router.use('/auth', authRouter)
router.use('/find', findRouter)
router.use('/lk', lkRouter)
router.use('/tags', tagRouter)


export default router