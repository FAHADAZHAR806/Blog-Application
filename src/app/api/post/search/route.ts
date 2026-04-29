import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Extract query params from the URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const tag = searchParams.get("tag");
    const author = searchParams.get("author");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    // Build the dynamic filter object
    let filter: any = { status: "published" };

    // 1. Full-Text Search Logic
    if (query) {
      filter.$text = { $search: query };
    }

    // 2. Tag Filtering Logic
    if (tag) {
      filter.tags = tag;
    }

    // 3. Author Filtering Logic
    if (author) {
      filter.author = author;
    }

    // Execute query with Pagination
    const posts = await Post.find(filter)
      .select("-content") // Don't send full content to the list view (save bandwidth)
      .populate("author", "name profileImage")
      .sort(query ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(filter);

    return successResponse({
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search Error:", error);
    return errorResponse("Search failed", 500);
  }
}
