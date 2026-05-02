import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-utils";

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Auth check
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded: any = verifyToken(token || "");

    // 2. Role check (Sirf Admin allowed hai)
    const adminUser = await User.findById(decoded.id || decoded._id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Access Denied. Admins only." },
        { status: 403 },
      );
    }

    // 3. Stats gather karein
    const [totalUsers, totalPosts, usersList] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      User.find({}, "name email role createdAt").sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({
      success: true,
      stats: { totalUsers, totalPosts },
      users: usersList,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
