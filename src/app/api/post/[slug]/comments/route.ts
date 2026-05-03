import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post"; // Post model zaroori hai slug check karne ke liye
import { withAuth } from "@/lib/middleware-utils";
import { successResponse, errorResponse } from "@/lib/api-response";

async function commentHandler(req: Request, user: any, context: any) {
  try {
    const params = await context?.params;
    const slug = params?.slug;

    if (!slug) return errorResponse("Slug is missing", 400);

    const { content } = await req.json();
    if (!content) return errorResponse("Comment content is required", 400);

    await connectDB();

    // 1. Slug se Post dhoondein taake real ID mil sake
    const post = await Post.findOne({ slug });
    if (!post) return errorResponse("Post not found", 404);

    // 2. Comment create karein using post._id
    const comment = await Comment.create({
      content,
      author: user.id || user._id,
      post: post._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name profileImage",
    );

    return successResponse(populatedComment, "Comment added", 201);
  } catch (error: any) {
    console.error("Comment Error:", error.message);
    return errorResponse(`Failed to add comment: ${error.message}`, 500);
  }
}

export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    const params = await context.params;
    const slug = params.slug;

    const post = await Post.findOne({ slug });
    if (!post) return errorResponse("Post not found", 404);

    const comments = await Comment.find({ post: post._id })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    return successResponse(comments);
  } catch (error) {
    return errorResponse("Failed to fetch comments", 500);
  }
}

export const POST = withAuth(commentHandler);
