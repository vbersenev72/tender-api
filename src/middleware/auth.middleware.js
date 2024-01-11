import jwt from 'jsonwebtoken'
import { secret } from '../../config.js'


export default (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Auth error' })
        }
        const decoded = jwt.verify(token, secret)
        
        req.user = decoded
        next()
    } catch (error) {

        return res.status(401).json({ message: 'Auth error' })
    }
}