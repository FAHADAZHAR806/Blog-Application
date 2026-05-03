import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";

// --- GET METHOD (UNCHANGED) ---
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

// --- FIXED POST METHOD ---
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Debugging: Terminal mein check karein ke data aa raha hai ya nahi
    console.log("Payload received:", body);

    if (!body.title || !body.content || !body.slug || !body.author) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: Title, Content, Slug, or Author.",
        },
        { status: 400 },
      );
    }

    const newPost = await Post.create(body);

    return NextResponse.json(
      {
        success: true,
        data: newPost,
        message: "Post created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create Post Error:", error);
    if (error.code === 11000) return errorResponse("Slug already exists", 400);
    return errorResponse(error.message, 500);
  }
}

// --- PUT & DELETE (UNCHANGED) ---
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
    return successResponse(updatedPost, "Updated");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ post: id });
    return successResponse(null, "Deleted");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
