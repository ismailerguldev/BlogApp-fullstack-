import express from "express"
import { autoLogin, changePassword, changeUsername, follow, login, logout, register, verify } from "../controllers/userControllers.ts"
import { tokenVerify } from "../middlewares/verifyToken.ts"
const router = express.Router()
router.route("/").get((req, res) => {
    res.status(200).json({ message: "oldu" })
})
router.route("/register").post(register)
router.route("/verify").post(verify)
router.route("/logout").post(tokenVerify, logout)
router.route("/login").post(login)
router.route("/autoLogin").post(tokenVerify, autoLogin)
router.route("/:followed_id/follow").post(tokenVerify, follow)
router.route("/change/username").patch(tokenVerify, changeUsername)
router.route("/change/password").patch(tokenVerify, changePassword)
export default router