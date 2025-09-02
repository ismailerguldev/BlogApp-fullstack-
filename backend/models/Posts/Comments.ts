import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
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
    commentText: {
        type: String,
        required: true
    },
    commentAt: {
        type: Date,
        default: Date.now
    },
    replyCount: {
        type: Number,
        default: 0
    }

    ,
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);
