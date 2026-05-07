import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await dbConnect();

    // 1. Token ko hash karein kyunki humne DB mein hash karke save kiya hota hai (security ke liye)
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. User dhoondein jiska token match ho aur expire na hua ho
    // $gt: Date.now() check karta hai ke expiry time abhi guzra nahi hai
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token is invalid or has expired" },
        { status: 400 },
      );
    }

    // 3. Naya Password hash karein
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Token fields ko clear kar dein taake dobara use na ho sakay
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
