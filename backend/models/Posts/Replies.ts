import mongoose, { Schema } from "mongoose";

const ReplySchema = new Schema({
    comment_id: {
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref:"User"
    },
    replyText: {
        type: String,
        required: true
    },
    repliedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model("Post", ReplySchema);
