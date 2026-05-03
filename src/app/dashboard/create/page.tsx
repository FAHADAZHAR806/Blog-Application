"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import MaterialCard from "@/components/ui/MaterialCard";
import { fileToBase64 } from "@/lib/file-to-base64";

// RichTextEditor dynamic import for SSR safety
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-xl" />
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
      setImage(base64);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userString = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const user = userString ? JSON.parse(userString) : null;

    if (!user || !token) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl = "";
      if (image) {
        // IMAGE UPLOAD CALL
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image, folder: "posts" }),
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.data?.url || "";
      }

      // Generate Clean Slug
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // POST CREATION CALL - Headers fixed here
      const postRes = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // YEH LAZMI HAI
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          coverImage: imageUrl,
          slug: slug,
          author: user._id || user.id, // Backend checks this
          status: "published",
        }),
      });

      const result = await postRes.json();

      if (postRes.ok) {
        router.push("/");
        router.refresh();
      } else {
        // Backend message will show here
        setError(result.error || "Failed to publish.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Create New Post
        </h1>

        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <MaterialCard>
            <input
              type="text"
              placeholder="Post Title"
              className="w-full text-4xl font-bold bg-transparent border-b border-gray-200 focus:border-blue-600 outline-none py-4 mb-6"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:opacity-90 cursor-pointer"
              />
              {image && (
                <img
                  src={image}
                  className="mt-4 w-full h-48 object-cover rounded-xl border border-gray-100"
                  alt="Preview"
                />
              )}
            </div>

            <RichTextEditor content={content} onChange={setContent} />

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
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
