import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    post_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Post"
    },
    likedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model("Like", LikeSchema);
