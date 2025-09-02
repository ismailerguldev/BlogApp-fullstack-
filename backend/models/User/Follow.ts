import mongoose, { Schema } from "mongoose";

const FollowSchema = new Schema({
    follower_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    followed_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    followedAt: {
        type: Date,
        default: Date.now
    }
    ,
}, { timestamps: true });

export default mongoose.model("Follow", FollowSchema);
