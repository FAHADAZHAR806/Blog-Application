import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { withAuth } from "@/lib/middleware-utils";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET all comments for a specific post
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // Params is now a Promise
) {
  try {
    await connectDB();
    const { id } = await params; // Await the params

    const comments = await Comment.find({ post: id })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    return successResponse(comments);
  } catch (error) {
    return errorResponse("Failed to fetch comments", 500);
  }
}

// POST a new comment
async function commentHandler(
  req: Request,
  user: any,
  { params }: { params: Promise<{ id: string }> }, // Params is now a Promise
) {
  try {
    const { id } = await params; // Await the params
    const { content } = await req.json();

    if (!content) return errorResponse("Comment content is required", 400);

    await connectDB();
    const comment = await Comment.create({
      content,
      author: user.id || user._id, // Safety check for ID field name
      post: id,
    });

    // Created comment ko populate karke wapas bhejien taake foran UI par naam dikhe
    const populatedComment = await comment.populate(
      "author",
      "name profileImage",
    );

    return successResponse(populatedComment, "Comment added", 201);
  } catch (error) {
    console.error("Comment Error:", error);
    return errorResponse("Failed to add comment", 500);
  }
}

export const POST = withAuth(commentHandler);
