import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { LoginSchema } from "@/validations/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. Validate data
    const { email, password } = LoginSchema.parse(body);

    // 2. Find user & explicitly select password (since it's hidden by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user) return errorResponse("Invalid credentials", 401);

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return errorResponse("Invalid credentials", 401);

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    return successResponse(
      { token, _id: user._id, role: user.role, name: user.name },
      "Login successful",
    );
  } catch (error: any) {
    return errorResponse(error.message || "Something went wrong", 500);
  }
}
