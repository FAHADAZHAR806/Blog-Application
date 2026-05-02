import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { RegisterSchema } from "@/validations/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. Validate data (ab isme role bhi validate hoga)
    const validatedData = RegisterSchema.parse(body);

    const userExists = await User.findOne({ email: validatedData.email });
    if (userExists) return errorResponse("User already exists", 400);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // 2. Create user (role validatedData ke andar se hi chala jayega)
    const user = await User.create({
      ...validatedData,
      password: hashedPassword,
    });

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
    console.error("Registration Error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
