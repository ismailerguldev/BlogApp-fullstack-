import type { Request, Response } from "express";
import UserActions from "../models/User/UserActions.ts";
import type { AuthRequest } from "../middlewares/verifyToken.ts";
export const register = async (req: Request, res: Response) => {
    const user = await UserActions.registerUser(req.body.username, req.body.email, req.body.password)
    res.status(201).json(
        {
            message: "User Registered Successfully",
            data: user
        }
    )
}
export const verify = async (req: Request, res: Response) => {
    const user = await UserActions.verifyUser(req.body.user_id, req.body.code)
    res.status(200).json(user)
}
export const logout = async (req: AuthRequest, res: Response) => {
    const user = await UserActions.logoutUser(req.user.user_id)
    res.status(200).json(user)
}
export const login = async (req: Request, res: Response) => {
    const { user } = await UserActions.loginUser(req.body.email, req.body.password)
    res.status(200).json(user)
}
export const autoLogin = async (req: Request, res: Response) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "Bad request. Token not found." })
        }
        const user = await UserActions.autoLogin(token)
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }
        res.status(200).json(user)
    } catch (error: any) {
        res.status(401).json({ message: "Invalid or expired token" })
    }
}
export const follow = async (req: AuthRequest, res: Response) => {
    const follow = await UserActions.handleFollow(req.user.user_id, req.params.followed_id)
    res.status(200).json(
        {
            message: "Follow Succeedd",
            followInfo: follow,
        }
    )
}
export const changeUsername = async (req: AuthRequest, res: Response) => {
    const updatedUser = await UserActions.changeUsername(req.user.user_id, req.body.username)
    res.status(200).json({
        message: "Change username done!",
        updatedUser: updatedUser
    })
}
export const changePassword = async (req: AuthRequest, res: Response) => {
    const updatedUser = await UserActions.changePassword(req.user.user_id, req.body.updated_password)
    res.status(200).json(
        {
            message: "Change password succeedd",
            updatedUser: updatedUser
        }
    )
}