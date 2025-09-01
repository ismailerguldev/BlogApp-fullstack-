import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // ref ekledik
});

export default mongoose.model("Post", PostSchema);
