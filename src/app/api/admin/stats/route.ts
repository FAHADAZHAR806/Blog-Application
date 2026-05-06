import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { withAuth } from "@/lib/middleware-utils";
import { NextResponse } from "next/server";

async function adminStatsHandler(req: Request, user: any) {
  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized access denied" },
      { status: 403 },
    );
  }

  try {
    await connectDB();

    // 1. Core Platform Metrics
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();

    // Calculate Global Likes (Platform-wide engagement)
    const likesAggregation = await Post.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $size: { $ifNull: ["$likes", []] } } },
        },
      },
    ]);
    const totalLikes =
      likesAggregation.length > 0 ? likesAggregation[0].total : 0;

    // 2. Creator Performance (For the first table in UI)
    const creatorPerformance = await User.aggregate([
      { $match: { role: { $in: ["author", "admin"] } } },
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
          role: 1,
          postCount: { $size: "$posts" },
          likesReceived: {
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
      { $sort: { postCount: -1 } },
    ]);

    // 3. Reader Activity (For the second table in UI)
    const readerPerformance = await User.aggregate([
      { $match: { role: "reader" } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "author",
          as: "writtenComments",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          commentsWritten: { $size: "$writtenComments" },
          // Note: Likes given requires a deeper lookup if likes are just IDs in Post model
          likesGiven: { $literal: 0 }, // Placeholder if tracking specific likes given is complex
        },
      },
    ]);

    // 4. Master User List (For Management Actions)
    const allUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        totalLikes,
        authorsCount: await User.countDocuments({ role: "author" }),
        readersCount: await User.countDocuments({ role: "reader" }),
      },
      creatorPerformance,
      readerPerformance,
      users: allUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(adminStatsHandler);
