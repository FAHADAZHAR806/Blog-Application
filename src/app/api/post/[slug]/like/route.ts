import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { withAuth } from "@/lib/middleware-utils";
import { successResponse, errorResponse } from "@/lib/api-response";

async function toggleLikeHandler(
  req: Request,
  user: any,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const postId = params.id;

    // Find the post to check if user already liked it
    const post = await Post.findById(postId);
    if (!post) return errorResponse("Post not found", 404);

    const hasLiked = post.likes.includes(user.id);

    if (hasLiked) {
      // Unlike: Remove user ID from the array
      await Post.findByIdAndUpdate(postId, { $pull: { likes: user.id } });
      return successResponse({ liked: false }, "Post unliked");
    } else {
      // Like: Add user ID to the array (ensuring no duplicates)
      await Post.findByIdAndUpdate(postId, { $addToSet: { likes: user.id } });
      return successResponse({ liked: true }, "Post liked");
    }
  } catch (error) {
    return errorResponse("Action failed", 500);
  }
}

export const POST = withAuth(toggleLikeHandler);
