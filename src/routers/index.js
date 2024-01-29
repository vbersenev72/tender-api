import { Router } from "express";
import authRouter from "./auth.router.js";
import findRouter from "./find.router.js";
import lkRouter from "./lk.router.js";
import tagRouter from "./tag.router.js";
import autoSearchRouter from "./autoSearch.router.js";

const router = Router()

router.use('/auth', authRouter)
router.use('/find', findRouter)
router.use('/lk', lkRouter)
router.use('/tags', tagRouter)
router.use('/autosearch', autoSearchRouter)

export default router