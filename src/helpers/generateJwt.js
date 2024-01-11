import { secret } from "../../config.js"
import jwt from "jsonwebtoken"

const generateJwt = (id) => {
    return jwt.sign(
        { id },
        secret,
        { expiresIn: '72h' }
    )
}

export default generateJwt