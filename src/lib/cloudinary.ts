import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary.
 * Accepts a base64 string or a file buffer.
 */
export const uploadImage = async (fileStr: string, folder: string) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: `blog_platform/${folder}`,
      resource_type: "auto",
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export default cloudinary;
