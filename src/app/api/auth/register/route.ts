import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { RegisterSchema } from "@/validations/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. Validate incoming data
    const validatedData = RegisterSchema.parse(body);

    // 2. Check if user already exists
    const userExists = await User.findOne({ email: validatedData.email });
    if (userExists) return errorResponse("User already exists", 400);

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // 4. Create user
    const user = await User.create({
      ...validatedData,
      password: hashedPassword,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject();

    return successResponse(
      userWithoutPassword,
      "User registered successfully",
      201,
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(error.errors[0].message, 400);
    }
    return errorResponse("Internal Server Error", 500);
  }
}
