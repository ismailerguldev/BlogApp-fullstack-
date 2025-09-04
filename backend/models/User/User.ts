import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    totalPost: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    followings: {
        type: Number,
        default: 0
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    emailVerified:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })
const UserModel = mongoose.model("User", UserSchema)
export default UserModel