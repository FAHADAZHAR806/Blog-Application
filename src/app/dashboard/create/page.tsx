"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic"; // Dynamic import add kiya
import MaterialCard from "@/components/ui/MaterialCard";
import { fileToBase64 } from "@/lib/file-to-base64";

// RichTextEditor ko dynamic load karein taake Hydration Error na aaye
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-50 animate-pulse rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400">
        Loading Editor...
      </div>
    ),
  },
);

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setImage(base64); // Local preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Get User Data
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setError("You must be logged in to publish.");
      setLoading(false);
      return;
    }

    try {
      // 2. Upload to Cloudinary
      let imageUrl = "";
      if (image) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({ image, folder: "posts" }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.data?.url || "";
      }

      // 3. Generate Slug
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // 4. Create Post in MongoDB
      const postRes = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          coverImage: imageUrl,
          status: "published",
          slug,
          author: user._id || user.id,
        }),
      });

      const postData = await postRes.json();

      if (postRes.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(postData.error || "Failed to create post. Check all fields.");
      }
    } catch (err) {
      console.error(err);
      setError("A connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Post
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <MaterialCard>
            {/* Title Input */}
            <input
              type="text"
              placeholder="Post Title"
              className="w-full text-4xl font-bold bg-transparent border-b border-surface-variant focus:border-primary outline-none py-4 mb-6"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Image Picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-secondary">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white hover:file:opacity-90 cursor-pointer"
              />
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded-xl border border-gray-100"
                />
              )}
            </div>

            {/* TipTap Integration (Now dynamically imported) */}
            <RichTextEditor content={content} onChange={setContent} />

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-m3-1 hover:shadow-m3-2 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </MaterialCard>
        </form>
      </div>
    </main>
  );
}
