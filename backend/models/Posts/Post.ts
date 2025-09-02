import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Post", PostSchema);
