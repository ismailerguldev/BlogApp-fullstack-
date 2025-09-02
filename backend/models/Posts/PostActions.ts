import Post from "./Post.ts"
import Like from "./Likes.ts"
import mongoose from "mongoose"
import Likes from "./Likes.ts"
import Comments from "./Comments.ts"
export const loadPosts = async (page: number, pageSize: number): Promise<object[]> => {
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
export const addPost = async (title: string, body: string, user_id: string): Promise<object> => {
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
export const getPost = async (id: string): Promise<object> => {
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
export const searchPost = async (search: string, limit: number = 5): Promise<object[]> => {
    try {
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

export const getUserPosts = async (user_id: string, page: number, pageSize: number): Promise<object[]> => {
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

export const delPost = async (_id: string, user_id: string) => {
    try {
        const post = await Post.findById(_id)
        if (!post) {
            throw new Error("Post not found")
        }
        if (post._id.toString() !== user_id) {
            throw new Error("You haven't access to delete this post!")
        }
        const deleted = await Post.deleteOne({ _id })
        return deleted
    } catch (error) {
        console.error(error)
    }
}

export const updatePost = async (_id: string, user_id: string, data: { title: string, body: string }): Promise<object> => {
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
        console.error(error)
        return {}
    }
}

export const hanldeLikePost = async (_id: string, user_id: string) => {
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
export const addComment = async (post_id: string, user_id: string, commentText: string) => {
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
export const editComment = async (comment_id: string, user_id: string, editCommentText: string) => {
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
export const deleteComment = async (comment_id: string, user_id: string, post_id: string) => {
    try {
        const comment = await Comments.findOneAndDelete(
            { _id: new mongoose.Types.ObjectId(comment_id), user_id: new mongoose.Types.ObjectId(user_id) },
        )
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