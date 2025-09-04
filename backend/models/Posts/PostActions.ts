import Post from "./Post.ts"
import mongoose from "mongoose"
import Likes from "./Likes.ts"
import Comments from "./Comments.ts"
import Replies from "./Replies.ts"
const loadPosts = async (page: number, pageSize: number) => {
    try {
        const result = await Post.aggregate([
            {
                $facet:
                {
                    data:
                        [
                            { $sort: { createdAt: -1 } },
                            { $skip: pageSize * (page - 1) },
                            { $limit: pageSize },
                            {
                                $project:
                                    { title: 1, createdAt: 1, body: 1 }
                            }
                        ],
                    totalCount: [{ $count: "count" }]
                }
            },
            {
                $project:
                {
                    data: 1,
                    total:
                        { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
                    totalPages:
                    {
                        $ceil:
                        {
                            $divide: [{ $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] }, pageSize]
                        }
                    },
                    page: { $literal: page },
                    pageSize: { $literal: pageSize }
                }
            }
        ])
        return result[0]
    } catch (error) {
        console.error("An error occured while loading Posts", error)
        return []
    }
}
const addPost = async (title: string, body: string, user_id: string) => {
    try {
        const newPost = await Post.create({
            title, body, user_id,
        })
        console.log(newPost)
        return newPost
    } catch (error) {
        throw new Error("An error occured while adding post")
    }
}
const getPost = async (id: string) => {
    try {
        const post = await Post.findById(id)
        if (post) {
            return post
        } else {
            return {}
        }
    } catch (error) {
        console.error("An error occured while getting post", error)
        return {}
    }
}
const searchPost = async (search: string, limit: number = 5) => {
    try {
        if (!search || search === "") throw new Error("No search query")
        const result = await Post.aggregate([
            {
                $search: {
                    index: "PostSearch",
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: search,
                                    path: "title",
                                    fuzzy: { maxEdits: 1, }
                                }
                            },
                            {
                                autocomplete: {
                                    query: search,
                                    path: "body",
                                    fuzzy: { maxEdits: 1, }
                                }
                            }
                        ]
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            {
                $project: {
                    title: 1,
                    body: 1,
                    createdAt: 1,
                }
            }
        ]);

        return result;
    } catch (error) {
        console.error("Error while searching posts:", error);
        throw new Error("An error occurred while searching posts");
    }
};

const getUserPosts = async (user_id: string, page: number, pageSize: number) => {
    try {
        const posts = await Post.aggregate([
            {
                $facet: {
                    data: [
                        { $match: { user_id: new mongoose.Types.ObjectId(user_id), isPrivate: false } },
                        { $sort: { createdAt: -1, } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        { $unwind: "$user" },
                        {
                            $project: {
                                title: 1,
                                body: 1,
                                "user.username": 1,
                                "user.email": 1,
                            }
                        }
                    ],
                    totalCount: [
                        { $match: { user_id: new mongoose.Types.ObjectId(user_id), isPrivate: false } },
                        { $count: "count" }
                    ]
                }
            },
            {
                $project:
                {
                    data: 1,
                    total:
                        { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
                    totalPages:
                    {
                        $ceil:
                        {
                            $divide: [{ $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] }, pageSize]
                        }
                    },
                    page: { $literal: page },
                    pageSize: { $literal: pageSize }
                }
            }
        ])
        if (posts) {
            return posts
        } else {
            return []
        }
    } catch (error) {
        console.error("An error occured while getting user posts", error)
        return []
    }
}

const delPost = async (_id: string, user_id: string) => {
    try {
        const post = await Post.findById(_id)
        if (!post) {
            throw new Error("Post not found")
        }
        if (post.user_id.toString() !== user_id) {
            throw new Error("You haven't access to delete this post!")
        }
        const deleted = await Post.deleteOne({ _id })
        return deleted
    } catch (error) {
        console.error(error)
    }
}

const updatePost = async (_id: string, user_id: string, data: { title: string, body: string }) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(_id), user_id: new mongoose.Types.ObjectId(user_id) },
            {
                $set: {
                    title: data.title,
                    body: data.body
                }
            },
            {
                new: true
            }
        )
        if (!post) {
            throw new Error("Post not found or you have'nt access for do this.")
        }
        return post
    } catch (error) {
        console.error("An error occured while update Post", error)
        return {}
    }
}

const handleLikePost = async (_id: string, user_id: string) => {
    try {
        const like = await Likes.findOneAndUpdate(
            { post_id: new mongoose.Types.ObjectId(_id), user_id: new mongoose.Types.ObjectId(user_id), },
            { $setOnInsert: { likedAt: new Date() } },
            { upsert: true, new: true, includeResultMetadata: true }
        )
        if (like.lastErrorObject?.upserted) {
            const post = await Post.findByIdAndUpdate(
                new mongoose.Types.ObjectId(_id),
                {
                    $inc: { likeCount: 1 }
                },
                {
                    new: true
                }
            )
            return { like, post }
        } else {
            const deletedLike = await Likes.findOneAndDelete(
                { post_id: new mongoose.Types.ObjectId(_id), user_id: new mongoose.Types.ObjectId(user_id) }
            )
            const post = await Post.findByIdAndUpdate(
                new mongoose.Types.ObjectId(_id),
                {
                    $inc: { likeCount: -1 }
                },
                {
                    new: true
                }

            )
            return { like, post, deletedLike }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}
const addComment = async (post_id: string, user_id: string, commentText: string) => {
    try {
        const comment = await Comments.create({
            post_id: new mongoose.Types.ObjectId(post_id),
            user_id: new mongoose.Types.ObjectId(user_id),
            commentText: commentText
        })
        const post = await Post.findOneAndUpdate(
            { _id: post_id },
            {
                $inc: {
                    commentCount: 1
                }
            },
            {
                new: true
            }
        )
        return { comment, post }
    } catch (error) {
        console.log(error)
    }
}
const editComment = async (comment_id: string, user_id: string, editCommentText: string) => {
    try {
        const editedComment = await Comments.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(comment_id), user_id: new mongoose.Types.ObjectId(user_id) },
            {
                $set: {
                    commentText: editCommentText
                }
            },
            { new: true }
        )
        return editedComment
    } catch (error) {
        console.log(error)
    }
}
const deleteComment = async (comment_id: string, user_id: string) => {
    try {
        const comment = await Comments.findOneAndDelete(
            { _id: new mongoose.Types.ObjectId(comment_id), user_id: new mongoose.Types.ObjectId(user_id) },
        )
        const post_id = comment?.post_id
        const post = await Post.findOneAndUpdate(
            { _id: post_id },
            {
                $inc: {
                    commentCount: -1
                }
            },
            {
                new: true
            }
        )
        return { comment, post }
    } catch (error) {
        console.log(error)
    }
}
const addReply = async (comment_id: string, user_id: string, replyText: string) => {
    try {
        const reply = await Replies.create({
            user_id: new mongoose.Types.ObjectId(user_id),
            comment_id: new mongoose.Types.ObjectId(comment_id),
            replyText: replyText
        })
        const comment = await Comments.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(comment_id)
            },
            {
                $inc: {
                    replyCount: 1
                }
            },
            { new: true }
        )
        const post = await Post.findOneAndUpdate(
            { _id: comment?.post_id },
            {
                $inc: {
                    commentCount: 1
                }
            },
            {
                new: true
            }
        )
        return { reply, post, comment }
    } catch (error) {
        console.log(error)
    }
}
const editReply = async (reply_id: string, user_id: string, editReplyText: string) => {
    try {
        const editedReply = await Replies.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(reply_id), user_id: new mongoose.Types.ObjectId(user_id) },
            {
                $set: {
                    replyText: editReplyText
                }
            },
            { new: true }
        )
        return editedReply
    } catch (error) {
        console.log(error)
    }
}
const deleteReply = async (reply_id: string, user_id: string,) => {
    try {
        const reply = await Replies.findOneAndDelete(
            { _id: new mongoose.Types.ObjectId(reply_id), user_id: new mongoose.Types.ObjectId(user_id) },
        )
        const comment = await Comments.findOneAndUpdate(
            { _id: reply?.comment_id },
            {
                $inc: {
                    replyCount: -1
                }
            },
            { new: true }
        )
        if (!reply) return null
        const post = await Post.findOneAndUpdate(
            { _id: comment?.post_id },
            {
                $inc: {
                    commentCount: -1
                }
            },
            {
                new: true
            }
        )
        
        return { comment, post, reply }
    } catch (error) {
        console.log(error)
    }
}
export default { loadPosts, addPost, getPost, searchPost, getUserPosts, delPost, updatePost, handleLikePost, addComment, editComment, deleteComment, addReply, editReply, deleteReply }