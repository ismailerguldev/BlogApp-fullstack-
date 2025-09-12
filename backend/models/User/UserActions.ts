import User from "./User.ts";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken";
import Follow from "./Follow.ts";
import mongoose from "mongoose";
import crypto, { verify } from "crypto"
import { sendVerificationCode } from "../../services/emailVerification.ts";
import redisClient from "../../config/redis.ts";
import { config } from "../../config/config.ts";
const registerUser = async (username: string, email: string, password: string) => {
    try {
        const existingUser = await User.findOne({ email, username })
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
const verifyUser = async (user_id: string, verificationCode: string) => {
    const storedCode = await redisClient.get(`verify:${user_id}`)
    if (!storedCode) throw new Error("Code Expired")
    if (storedCode !== verificationCode) throw new Error("Invalid Code")
    const user = await User.findByIdAndUpdate(user_id, { emailVerified: true }, { new: true })
    if (!user) throw new Error("Error while getting user in verifyuser")
    await redisClient.del(`verify:${user_id}`)
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
}
const logoutUser = async (user_id: string) => {
    try {
        const user = await User.findByIdAndUpdate(user_id, { emailVerified: false }, { new: true })
        return user
    } catch (error: any) {
        throw new Error(`An error occured while logout. ${error}`)
    }
}
const autoLogin = async (token: string) => {
    const decoded = jwt.verify(token!, config.JWT_SECRET as string) as JwtPayload
    const username: string = decoded.username as string
    const user_id: string = decoded.user_id as string
    const user = await User.findOne({ username, _id: new mongoose.Types.ObjectId(user_id) })
    if (!user) {
        throw new Error("User not found. Autologin canceled.")
    } else {
        return {
            username: user.username,
            email: user.email,
            totalPost: user.totalPost,
            followers: user.followers,
            followings: user.followings
        }
    }

}
const loginUser = async (email: string, password: string) => {
    try {
        const user = await User.findOne({ email })
        if (!user) throw new Error("This email is not registered yet!")
        if (!await bcrypt.compare(password, user.password)) throw new Error("Invalid E-Mail or Password!")
        const verificationCode = crypto.randomInt(100000, 999999).toString()
        await redisClient.setEx(`verify:${user._id}`, 86400, verificationCode)
        sendVerificationCode(user.email, verificationCode)
        return {
            user: {
                user_id: user._id,
                username: user.username,
                followers: user.followers,
                followings: user.followings,
                totalPost: user.totalPost
            },
        }
    } catch (error) {
        throw new Error(`An error occured while Logging: ${error}`)
    }
}
const handleFollow = async (follower_id: string, followed_id: string) => {
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
    catch (error: any) {
        throw new Error(error)
    }
}
const changeUsername = async (user_id: string, username: string) => {
    try {
        const user = await User.findByIdAndUpdate(
            user_id,
            {
                $set: {
                    username: username
                }
            }
        )
        return user
    } catch (error: any) {
        throw new Error(error)
    }
}
const changePassword = async (user_id: string, password: string) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.findByIdAndUpdate(
            user_id,
            {
                $set: {
                    password: hashedPassword
                }
            }
        )
        return user
    } catch (error) {
        console.log(error)
    }
}
export default { registerUser, loginUser, handleFollow, changeUsername, changePassword, verifyUser, autoLogin, logoutUser }