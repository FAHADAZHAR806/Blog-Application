import { uploadImage } from "@/lib/cloudinary";
import { withAuth } from "@/lib/middleware-utils";
import { successResponse, errorResponse } from "@/lib/api-response";

async function uploadHandler(req: Request) {
  try {
    const { image, folder } = await req.json();

    if (!image) {
      return errorResponse("No image data provided", 400);
    }

    const imageUrl = await uploadImage(image, folder || "general");

    return successResponse({ url: imageUrl }, "Image uploaded successfully");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export const POST = withAuth(uploadHandler);
