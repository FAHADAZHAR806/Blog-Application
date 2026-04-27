"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/editor/RichTextEditor";
import MaterialCard from "@/components/ui/MaterialCard";
import { fileToBase64 } from "@/lib/file-to-base64";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

    try {
      // 1. Upload to Cloudinary via our API
      let imageUrl = "";
      if (image) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({ image, folder: "posts" }),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.data.url;
      }

      // 2. Create Post in MongoDB
      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          content,
          coverImage: imageUrl,
          status: "published",
        }),
      });

      if (postRes.ok) router.push("/");
    } catch (err) {
      console.error(err);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <MaterialCard>
            {/* Title Input - Material Style */}
            <input
              type="text"
              placeholder="Post Title"
              className="w-full text-4xl font-bold bg-transparent border-b border-surface-variant focus:border-primary outline-none py-4 mb-6"
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
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white hover:file:opacity-90"
              />
            </div>

            {/* TipTap Integration */}
            <RichTextEditor content={content} onChange={setContent} />

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-8 py-3 rounded-full font-medium shadow-m3-1 hover:shadow-m3-2 transition-all disabled:bg-gray-400"
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
