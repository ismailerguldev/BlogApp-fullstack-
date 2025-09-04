import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config/config.ts"

export interface AuthRequest extends Request {
    user?: any
}
export const tokenVerify = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "No token found" })
        }
        const decoded = jwt.verify(token, config.JWT_SECRET!)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: `An error occured while verifing token: ${error}` })
    }
}