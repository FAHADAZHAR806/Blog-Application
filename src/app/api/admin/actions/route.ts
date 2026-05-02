import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import { withAuth } from "@/lib/middleware-utils";
import { successResponse, errorResponse } from "@/lib/api-response";

async function adminActionHandler(req: Request, user: any) {
  // 1. Double Security Check
  if (user.role !== "admin") {
    return errorResponse("Unauthorized: Admin access required", 403);
  }

  try {
    await connectDB();
    const { action, targetId, newRole } = await req.json();

    // 2. Action Logic
    switch (action) {
      case "CHANGE_ROLE":
        await User.findByIdAndUpdate(targetId, { role: newRole });
        return successResponse(null, `User role updated to ${newRole}`);

      case "DELETE_USER":
        await User.findByIdAndDelete(targetId);
        // User delete ho toh uski posts bhi delete honi chahiye (Optional)
        await Post.deleteMany({ author: targetId });
        return successResponse(null, "User and their posts deleted");

      case "DELETE_POST":
        await Post.findByIdAndDelete(targetId);
        return successResponse(null, "Post deleted by admin");

      default:
        return errorResponse("Invalid action", 400);
    }
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export const POST = withAuth(adminActionHandler);
