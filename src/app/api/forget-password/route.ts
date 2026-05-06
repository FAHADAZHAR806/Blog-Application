import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Pseudo-db connection (Yahan aap apna MongoDB/User model import karein)
// import User from "@/models/User";
// import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    // await connectDB();

    // 1. Check if user exists
    // const user = await User.findOne({ email });
    // if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. Create a Reset Token (Valid for 15-20 mins)
    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "20m" },
    );

    // 3. Create Reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

    // 4. Setup Nodemailer (Email Service)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password use karein
      },
    });

    const mailOptions = {
      from: '"Lumina HQ" <no-reply@luminahq.com>',
      to: email,
      subject: "Access Recovery Protocol: Reset Password",
      html: `
        <div style="font-family: sans-serif; padding: 40px; color: #1a1a1a;">
          <h1 style="font-style: italic; font-weight: 900; letter-spacing: -1px;">Lumina<span style="color: #2563eb;">.</span>HQ</h1>
          <p style="font-size: 14px; margin-top: 20px;">You requested a password reset. Click the button below to recover your account. This link expires in 20 minutes.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 12px; margin-top: 20px; text-transform: uppercase;">Reset Password</a>
          <p style="font-size: 10px; color: #94a3b8; margin-top: 40px; text-transform: uppercase; letter-spacing: 2px;">System Generated Recovery Protocol</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
