import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User"; // Required to register the User model for .populate()
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }, // Define as a Promise
) {
  await connectDB();

  try {
    // FIX: You MUST await the params before destructuring
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    console.log("Fetching post with slug:", slug);

    const post = await Post.findOne({ slug }).populate({
      path: "author",
      model: User,
      select: "name",
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
