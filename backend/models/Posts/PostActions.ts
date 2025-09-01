import Post from "./Post.ts"
import mongoose from "mongoose"
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
export const addPost = async (title: string, body: string, userId: string): Promise<object> => {
    try {
        const newPost = await Post.create({
            title, body, userId,
        })
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

export const getUserPosts = async (userId: string, page: number, pageSize: number): Promise<object[]> => {
    try {
        const posts = await Post.aggregate([
            {
                $facet: {
                    data: [
                        { $match: { userId: new mongoose.Types.ObjectId(userId), isPrivate: false } },
                        { $sort: { createdAt: -1, } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
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
                        { $match: { userId: new mongoose.Types.ObjectId(userId), isPrivate: false } },
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