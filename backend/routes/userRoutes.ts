import express from "express"
import { changePassword, changeUsername, follow, login, register, verify } from "../controllers/userControllers.ts"
import { tokenVerify } from "../middlewares/verifyToken.ts"
const router = express.Router()
router.route("/").get((req, res) => {
    res.status(200).json({ message: "oldu" })
})
router.route("/register").post(register)
router.route("/verify").post(verify)
router.route("/login").post(login)
router.route("/:followed_id/follow").post(tokenVerify, follow)
router.route("/change/username").patch(tokenVerify, changeUsername)
router.route("/change/password").patch(tokenVerify, changePassword)
export default router