import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { withAuth } from "@/lib/middleware-utils";
import { successResponse, errorResponse } from "@/lib/api-response";

async function toggleLikeHandler(req: Request, user: any, context: any) {
  try {
    await connectDB();

    const params = await context?.params;
    const slug = params?.slug;

    if (!slug) return errorResponse("Slug is missing", 400);

    // 1. Find post by slug
    const post = await Post.findOne({ slug });
    if (!post) return errorResponse("Post not found", 404);

    const userId = user.id || user._id;
    const hasLiked = post.likes.includes(userId);

    let updatedPost;

    if (hasLiked) {
      // 2. Unlike logic
      updatedPost = await Post.findOneAndUpdate(
        { slug },
        { $pull: { likes: userId } },
        { new: true },
      );
    } else {
      // 3. Like logic
      updatedPost = await Post.findOneAndUpdate(
        { slug },
        { $addToSet: { likes: userId } },
        { new: true },
      );
    }

    return successResponse(
      {
        liked: !hasLiked,
        count: updatedPost.likes.length,
      },
      hasLiked ? "Unliked" : "Liked",
    );
  } catch (error: any) {
    console.error("Like Error:", error.message);
    return errorResponse("Action failed", 500);
  }
}

export const POST = withAuth(toggleLikeHandler);
