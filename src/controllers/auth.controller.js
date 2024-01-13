import db from "../models/index.js";
import { uid } from "uid";
import bcrypt from 'bcryptjs'
import generateJwt from "../helpers/generateJwt.js";
import { sendEmail } from "../helpers/sendEmail.js";

const Users = db.users


class AuthController {

    async register(req, res) {
        try {

            const { name, email, phone, inn } = req.body

            if (!name || name === "") {
                return res.status(400).json({ message: "name is empty" })
            }
            if (!phone || phone === "") {
                return res.status(400).json({ message: "phone is empty" })
            }
            if (!email || email === "") {
                return res.status(400).json({ message: "email is empty" })
            }
            if (!inn || inn === "") {
                return res.status(400).json({ message: "inn is empty" })
            }

            const candidate = await Users.findOne({
                where: {
                    email: email
                }
            })

            if (candidate) {
                return res.status(400).json({ message: "user already registered" })
            }

            const password = uid(16)
            console.log(password);

            sendEmail('Пароль для использования Tender', "Ваш пароль для использования платформы Tender:\n"+password, email)
            
            const hashPassword = await bcrypt.hash(password, 5)
            let user = await Users.create({
                name,
                email,
                phone,
                password: hashPassword,
                inn,
                register_date: new Date().getTime(),

            })

            const token = generateJwt(user.id)
            return res.json({ token })

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "error", error })
        }
    }


    async login(req, res) {
        try {

            const {email, password} = req.body

            const candidate = await Users.findOne({ where: { email: email } })
            if (!candidate) {
                return res.status(404).json({message: "User not found"})
            }
            const isPassValid = bcrypt.compareSync(password, candidate.password)
            if (!isPassValid) {
                return res.status(400).json({message: "Invalid password"})
            }
            const token = generateJwt(candidate.id)
            return res.json({
                token,
                user: candidate
            })
            
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "error", error })
        }
    }


    async auth(req, res) {
        try {

            console.log(req.user);
            const id = req.user.id

            const user = await Users.findOne({ where: { id: id } })
            const token = generateJwt(id)
            return res.json({
                token,
                user: user
            })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: "Server error" })
        }
    }

}


export default new AuthController()