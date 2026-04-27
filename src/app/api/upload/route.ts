import { uploadImage } from "@/lib/cloudinary";
import { withAuth } from "@/lib/middleware-utils";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * API route to handle image uploads.
 * Restricted to logged-in users only.
 */
async function uploadHandler(req: Request) {
  try {
    const { image, folder } = await req.json();

    if (!image) {
      return errorResponse("No image data provided", 400);
    }

    // folder can be 'profiles', 'posts', etc.
    const imageUrl = await uploadImage(image, folder || "general");

    return successResponse({ url: imageUrl }, "Image uploaded successfully");
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

// Wrap withAuth so only logged-in users can use your Cloudinary bandwidth
export const POST = withAuth(uploadHandler);
