/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactCompiler: true, // Next.js 15+ feature
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
