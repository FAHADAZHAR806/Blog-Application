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
        // Admin role ko change hone se bachane ke liye (Security)
        const targetUser = await User.findById(targetId);
        if (targetUser?.role === "admin") {
          return errorResponse("Cannot modify Admin roles via this route", 400);
        }

        await User.findByIdAndUpdate(targetId, { role: newRole });
        return successResponse(null, `User access level shifted to ${newRole}`);

      case "DELETE_USER":
        // Khud ko delete karne se bachayein
        if (targetId === user.id) {
          return errorResponse("Self-destruction is not allowed", 400);
        }

        await User.findByIdAndDelete(targetId);
        // Cascade delete: Jab user jaye toh uski posts bhi saaf kar dein
        await Post.deleteMany({ author: targetId });
        return successResponse(null, "User node and associated data purged");

      case "DELETE_POST":
        await Post.findByIdAndDelete(targetId);
        return successResponse(null, "Content entry removed from system");

      default:
        return errorResponse("Invalid protocol action", 400);
    }
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export const POST = withAuth(adminActionHandler);
