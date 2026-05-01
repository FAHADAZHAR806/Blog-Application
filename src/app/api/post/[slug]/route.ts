import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-utils"; // Check karein ke file name auth-utils.ts hi hai

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const { slug } = await params;

    // Smart Search: Pehle ID se check karein, agar fail ho toh Slug se
    let post;

    // Check agar slug ek valid MongoDB ID hai
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(slug).populate({
        path: "author",
        model: User,
        select: "name",
      });
    }

    // Agar ID se nahi mila ya ID format nahi tha, toh slug se dhoondein
    if (!post) {
      post = await Post.findOne({ slug }).populate({
        path: "author",
        model: User,
        select: "name",
      });
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (err: any) {
    console.error("GET Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const { slug: postId } = await params; // Dashboard se hum ID bhejte hain jo slug param mein aati hai
    const body = await req.json();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded: any = verifyToken(token || "");

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check karein ke post user ki apni hai
    const post = await Post.findOneAndUpdate(
      { _id: postId, author: decoded.id || decoded._id },
      { $set: body }, // Title, content, image wagera update hoga
      { new: true },
    );

    if (!post) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. DELETE: Post delete karne ke liye (Uses ID passed as 'slug' param)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const { slug: postId } = await params; // Yahan 'slug' folder name hai par value ID hogi

    // Auth Header Check
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Delete operation (Sirf wahi banda delete kar sake jiski post hai)
    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      author: decoded.id || decoded._id,
    });

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err: any) {
    console.error("DELETE Error:", err);
    // Ensure ke error ke waqt bhi JSON hi wapas jaye
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
