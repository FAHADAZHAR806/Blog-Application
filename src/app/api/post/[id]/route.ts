import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  await connectDB();
  try {
    const { id } = params; // This 'id' variable will hold whatever is in the URL

    // Check if the 'id' is a valid MongoDB ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    // Smart Query: Search by slug if it's a string, or by _id if it's a valid ID
    const post = await Post.findOne(
      isObjectId ? { _id: id } : { slug: id },
    ).populate({
      path: "author",
      model: User,
      select: "name",
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
