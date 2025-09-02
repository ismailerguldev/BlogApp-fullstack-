import User from "./User.ts";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Follow from "./Follow.ts";
import mongoose from "mongoose";
export const registerUser = async (username: string, email: string, password: string): Promise<object> => {
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) throw new Error("This user already registered.")
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            username, email, password: hashedPassword
        })
        if (user) {
            return user
        } else {
            throw new Error(`An error occured while register user`)
        }
    } catch (error) {
        throw new Error(`An error occured while register user ${error}`)
    }
}
export const login = async (email: string, password: string): Promise<object> => {
    try {
        const user = await User.findOne({ email })
        if (!user) throw new Error("This email is not registered yet!")
        if (!await bcrypt.compare(password, user.password)) throw new Error("Invalid E-Mail or Password!")
        const token = jwt.sign(
            { user_id: user._id, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        )
        return {
            user: {
                user_id: user._id,
                username: user.username,
                followers: user.followers,
                followings: user.followings,
                totalPost: user.totalPost
            },
            token: token
        }
    } catch (error) {
        throw new Error(`An error occured while Logging: ${error}`)
    }
}
export const handleFollow = async (follower_id: string, followed_id: string) => {
    try {
        const follow = await Follow.findOneAndUpdate(
            { follower_id: new mongoose.Types.ObjectId(follower_id), followed_id: new mongoose.Types.ObjectId(followed_id) },
            { $setOnInsert: { followedAt: new Date() } },
            { upsert: true, new: true, includeResultMetadata: true, }
        )
        if (follow.lastErrorObject?.upserted) {
            const followedUser = await User.findByIdAndUpdate(
                new mongoose.Types.ObjectId(followed_id),
                {
                    $inc: {
                        followers: 1
                    }
                },
                { new: true }
            )
            const followerUser = await User.findByIdAndUpdate(
                new mongoose.Types.ObjectId(follower_id),
                {
                    $inc: {
                        followings: 1
                    }
                }
            )
            return { follow, followedUser, followerUser }
        } else {
            const deleteFollow = await Follow.findOneAndDelete(
                { follower_id: new mongoose.Types.ObjectId(follower_id), followed_id: new mongoose.Types.ObjectId(followed_id) }
            )
            const unFollowedUser = await User.findByIdAndUpdate(
                new mongoose.Types.ObjectId(followed_id),
                {
                    $inc: {
                        followers: -1
                    }
                },
                {
                    new: true
                },
            )
            const unFollowerUser = await User.findByIdAndUpdate(
                new mongoose.Types.ObjectId(follower_id),
                {
                    $inc: {
                        followings: -1
                    }
                },
                {
                    new: true
                },
            )
            return { follow, unFollowedUser, unFollowerUser, deleteFollow }
        }
    }
    catch (error) {
        console.error(error)
    }
}
