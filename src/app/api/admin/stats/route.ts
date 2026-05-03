import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { withAuth } from "@/lib/middleware-utils";
import { NextResponse } from "next/server";

async function adminStatsHandler(req: Request, user: any) {
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();

    // 1. Basic Counts
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();

    // 2. Role Breakdown
    const authorsCount = await User.countDocuments({ role: "author" });
    const readersCount = await User.countDocuments({ role: "reader" });

    // 3. Authors and their Engagement (Post count & Likes)
    // Hum har author ke liye uski posts fetch kar rahe hain
    const authorDirectory = await User.aggregate([
      { $match: { role: "author" } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          postCount: { $size: "$posts" },
          // Har post ke likes array ki length ka sum nikalna
          totalLikesReceived: {
            $sum: {
              $map: {
                input: "$posts",
                as: "post",
                in: { $size: { $ifNull: ["$$post.likes", []] } },
              },
            },
          },
        },
      },
    ]);

    // 4. All Users List for Directory
    const allUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        authorsCount,
        readersCount,
      },
      authorDirectory,
      users: allUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(adminStatsHandler);
