import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string; // Rich text HTML string
  coverImage?: string;
  author: mongoose.Types.ObjectId;
  status: "draft" | "published";
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

// Indexing for search performance
PostSchema.index({ title: "text", content: "text", tags: "text" });

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);
