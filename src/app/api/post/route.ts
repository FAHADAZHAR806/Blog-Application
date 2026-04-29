import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { PostCreateSchema } from "@/validations/post";
import { withAuth } from "@/lib/middleware-utils";
import { slugify } from "@/lib/slugify";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET all published posts (Public)
export async function GET(req: Request) {
  try {
    await connectDB();
    const posts = await Post.find({ status: "published" })
      .populate("author", "name profileImage") // Join user data
      .sort({ createdAt: -1 });

    return successResponse(posts);
  } catch (error) {
    return errorResponse("Failed to fetch posts", 500);
  }
}

// POST new blog post (Protected to Authors)
async function createHandler(req: Request, user: any) {
  try {
    await connectDB();
    const body = await req.json();
    const validatedData = PostCreateSchema.parse(body);

    const post = await Post.create({
      ...validatedData,
      author: user.id, // From JWT
      slug: slugify(validatedData.title),
    });

    return successResponse(post, "Post created successfully", 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export const POST = withAuth(createHandler, "author");
