import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { withAuth } from "@/lib/middleware-utils";
import { successResponse, errorResponse } from "@/lib/api-response";

async function getMyPostsHandler(req: Request, user: any) {
  try {
    await connectDB();

    // Sirf is author ki posts find karein
    const posts = await Post.find({ author: user.id }).sort({ createdAt: -1 });

    // Hamesha successResponse return karein (chahe array khali ho [])
    return successResponse(posts);
  } catch (error: any) {
    console.error("MyPosts API Error:", error);
    return errorResponse("Failed to fetch your posts", 500);
  }
}

// Sirf author ya admin apni posts dekh sakein
export const GET = withAuth(getMyPostsHandler);
