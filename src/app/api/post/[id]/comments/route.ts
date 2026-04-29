import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { withAuth } from "@/lib/middleware-utils";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET all comments for a specific post
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const comments = await Comment.find({ post: params.id })
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
  { params }: { params: { id: string } },
) {
  try {
    const { content } = await req.json();
    if (!content) return errorResponse("Comment content is required", 400);

    await connectDB();
    const comment = await Comment.create({
      content,
      author: user.id,
      post: params.id,
    });

    return successResponse(comment, "Comment added", 201);
  } catch (error) {
    return errorResponse("Failed to add comment", 500);
  }
}

export const POST = withAuth(commentHandler);
