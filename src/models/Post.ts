import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string; // ✅ ADD: pre-stripped plain text for feed cards
  coverImage?: string;
  author: mongoose.Types.ObjectId;
  status: "draft" | "published";
  category: string; // ✅ ADD: feed page uses post.category — was undefined
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    // ✅ Stored once at write time — never recomputed on every feed render
    excerpt: { type: String, default: "" },
    coverImage: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    category: { type: String, default: "Insight" },
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

// ✅ FIX: Compound index matches the exact feed query shape:
//    Post.find({ status: "published" }).sort({ createdAt: -1 })
//    Without this, Mongo does a full collection scan on every page load.
//    The text index for search stays separate — Mongo can only use one index per query.
PostSchema.index({ status: 1, createdAt: -1 });

// Full-text search index (used when query param is present)
PostSchema.index({ title: "text", content: "text", tags: "text" });

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);
