import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { errorResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";

// GET METHOD
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 12;
    const skip = (page - 1) * limit;
    const isAdminRequest = searchParams.get("adminView") === "true";

    let query = { status: "published" };
    if (isAdminRequest) {
      query = {} as any;
    }

    const posts = await Post.find(query)
      .populate("author", "name email profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    const postsWithEngagement = await Promise.all(
      posts.map(async (post: any) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post._doc,
          commentCount,
          likeCount: post.likes?.length || 0,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: postsWithEngagement,
      pagination: { currentPage: page, totalPages, totalPosts },
    });
  } catch (error: any) {
    return errorResponse("Failed to fetch posts", 500);
  }
}

// POST METHOD
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const missingFields = [];
    if (!body.title) missingFields.push("title");
    if (!body.content) missingFields.push("content");
    if (!body.slug) missingFields.push("slug");
    if (!body.author) missingFields.push("author");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const newPost = await Post.create(body);

    return NextResponse.json(
      { success: true, data: newPost, message: "Post created successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create Post Error:", error);
    if (error.code === 11000) return errorResponse("Slug already exists", 400);
    return errorResponse(error.message || "Internal Server Error", 500);
  }
}

// PUT METHOD (Zaroori changes ke sath)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 },
      );
    }

    // 1. Check if post exists
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    // 2. Update logic
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }, // validators on rakhein taake data theek save ho
    );

    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: "Post updated successfully",
    });
  } catch (error: any) {
    console.error("Update Error:", error);
    if (error.code === 11000) return errorResponse("Slug already exists", 400);
    return errorResponse(error.message, 500);
  }
}

// DELETE METHOD
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return errorResponse("ID is required", 400);

    await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ post: id });

    return NextResponse.json({
      success: true,
      message: "Post and its comments deleted",
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
