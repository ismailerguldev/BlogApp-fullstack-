import express from "express"
import { tokenVerify } from "../middlewares/verifyToken.ts"
import { addComment, addPost, addReply, deleteComment, deletePost, deleteReply, editComment, editReply, feedPosts, getPost, getUserPosts, likePost, search, updatePost } from "../controllers/postControllers.ts"
const router = express.Router()
router.route("/").get((req, res) => {
    res.status(200).json({ message: "oldu" })
})
router.route("/create").post(tokenVerify, addPost)
router.route("/search").get(search)
router.route("/user/:page/:pageSize").get(tokenVerify, getUserPosts)
router.route('/getPosts/:page/:pageSize').get(tokenVerify, feedPosts)
router.route("/:post_id")
    .get(getPost)
    .delete(tokenVerify, deletePost)
    .put(tokenVerify, updatePost)
    .post(tokenVerify, likePost)
router.route("/:post_id/comment")
    .post(tokenVerify, addComment)
router.route("/:comment_id/comment")
    .put(tokenVerify, editComment)
    .delete(tokenVerify, deleteComment)
router.route("/:comment_id/reply")
    .post(tokenVerify, addReply)
router.route("/:reply_id/reply")
    .put(tokenVerify, editReply)
    .delete(tokenVerify, deleteReply)
export default router