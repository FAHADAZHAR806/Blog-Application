import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // 1. Database Connection Check
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Security tip: User ko na batayen ke email exist nahi karta
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 404 },
      );
    }

    // 3. Create a Reset Token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is missing in .env");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const resetToken = jwt.sign({ email, id: user._id }, secret, {
      expiresIn: "20m",
    });

    // 4. Create Reset URL (Live ya Local dono ke liye)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;

    // 5. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Make sure this is an "App Password"
      },
    });

    const mailOptions = {
      from: '"Lumina HQ" <fahadkiyani28@gmail.com>',
      to: email,
      subject: "Access Recovery Protocol: Reset Password",
      html: `
        <div style="font-family: sans-serif; padding: 40px; color: #1a1a1a; background-color: #fbfbfb;">
          <h1 style="font-style: italic; font-weight: 900; letter-spacing: -1px; font-size: 24px;">Lumina<span style="color: #2563eb;">.</span>HQ</h1>
          <p style="font-size: 14px; margin-top: 20px; color: #475569;">You requested a password reset. Click the button below to recover your account.</p>
          <div style="margin-top: 30px;">
            <a href="${resetUrl}" style="background: #000; color: #fff; padding: 16px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 12px; text-transform: uppercase; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 40px;">This link will expire in 20 minutes. If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 20px;" />
          <p style="font-size: 10px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 2px;">System Generated Recovery Protocol</p>
        </div>
      `,
    };

    // Verify transporter configuration before sending
    await transporter.verify();
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Recovery email sent successfully",
    });
  } catch (error: any) {
    console.error("FORGET_PASSWORD_SERVER_ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to send email. Please check server logs." },
      { status: 500 },
    );
  }
}
