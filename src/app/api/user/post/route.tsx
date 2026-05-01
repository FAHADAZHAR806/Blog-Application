import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyToken } from "@/lib/auth-utils"; // Aapka token verify karne wala function

export async function GET(req: Request) {
  try {
    await dbConnect();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded = verifyToken(token); // Token se user id nikalein

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await Post.find({ author: decoded.id }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
