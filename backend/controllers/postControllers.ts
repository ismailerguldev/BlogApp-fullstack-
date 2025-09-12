import type { Request, Response } from "express";
import PostActions from "../models/Posts/PostActions.ts";
import type { AuthRequest } from "../middlewares/verifyToken.ts";
export const addPost = async (req: AuthRequest, res: Response) => {
    const post = await PostActions.addPost(req.body.title, req.body.body, req.user.user_id)
    res.status(201).json(
        {
            message: "Post creation succeedd",
            post: post
        }
    )
}
export const feedPosts = async (req: AuthRequest, res: Response) => {
    const posts = await PostActions.loadPosts(parseInt(req.params.page), parseInt(req.params.pageSize))
    res.status(200).json(posts)
}
export const getPost = async (req: Request, res: Response) => {
    const post = await PostActions.getPost(req.params.post_id)
    res.status(200).json(post)
}
export const search = async (req: Request, res: Response) => {
    const search = req.query.search?.toString() || ""
    const limit = parseInt(req.query.limit as string) || 5
    const result = await PostActions.searchPost(search, limit)
    res.status(200).json(
        result
    )
}
export const getUserPosts = async (req: AuthRequest, res: Response) => {
    const posts = await PostActions.getUserPosts(req.user.user_id, parseInt(req.params.page), parseInt(req.params.pageSize))
    res.status(200).json(posts)
}
export const deletePost = async (req: AuthRequest, res: Response) => {
    const deleted = await PostActions.delPost(req.params.post_id, req.user.user_id)
    res.status(200).json(deleted)
}
export const updatePost = async (req: AuthRequest, res: Response) => {
    const updatedPost = await PostActions.updatePost(req.params.post_id, req.user.user_id, { ...req.body })
    res.status(200).json(updatedPost)
}
export const likePost = async (req: AuthRequest, res: Response) => {
    const likeInfo = await PostActions.handleLikePost(req.params.post_id, req.user.user_id)
    res.status(200).json(likeInfo)
}
export const addComment = async (req: AuthRequest, res: Response) => {
    const commentInfo = await PostActions.addComment(req.params.post_id, req.user.user_id, req.body.comment)
    res.status(200).json(commentInfo)
}
export const editComment = async (req: AuthRequest, res: Response) => {
    const editedComment = await PostActions.editComment(req.params.comment_id, req.user.user_id, req.body.comment)
    res.status(200).json(editedComment)
}
export const deleteComment = async (req: AuthRequest, res: Response) => {
    const deleteInfo = await PostActions.deleteComment(req.params.comment_id, req.user.user_id)
    res.status(200).json(deleteInfo)
}
export const addReply = async (req: AuthRequest, res: Response) => {
    const replyInfo = await PostActions.addReply(req.params.comment_id, req.user.user_id, req.body.replyText)
    res.status(200).json(replyInfo)
}
export const editReply = async (req: AuthRequest, res: Response) => {
    const editedReply = await PostActions.editReply(req.params.reply_id, req.user.user_id, req.body.replyText)
    res.status(200).json(editedReply)
}
export const deleteReply = async (req: AuthRequest, res: Response) => {
    const deleteInfo = await PostActions.deleteReply(req.params.reply_id, req.user.user_id)
    res.status(200).json(deleteInfo)
}