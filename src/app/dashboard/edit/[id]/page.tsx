"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import MaterialCard from "@/components/ui/MaterialCard";
import { fileToBase64 } from "@/lib/file-to-base64";
import { ImagePlus, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// Rich Text Editor dynamic import
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-xl" />
    ),
  },
);

export default function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1. Load Purana Data (Consistent with your GET implementation)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Note: Humne GET mein saare posts ka logic likha hai,
        // specific post ke liye aapka route setup check karna hoga.
        // Filhal hum generic api call kar rahe hain:
        const res = await fetch(`/api/post`);
        const json = await res.json();

        if (json.success) {
          const post = json.data.find((p: any) => p._id === id);
          if (post) {
            setTitle(post.title || "");
            setContent(post.content || "");
            setImage(post.coverImage || "");
          } else {
            setError("Post not found in your database.");
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load post data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 2. Handle Image change
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setImage(base64);
    }
  };

  // 3. Update Function (Sync with your PUT backend)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      // Slug generation logic
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const res = await fetch(`/api/post`, {
        method: "PUT", // Apne backend ke mutabiq PUT rakha hai
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id, // Backend expects 'id' in body
          title: title.trim(),
          content: content.trim(),
          coverImage: image,
          slug: slug,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        router.push("/dashboard/my-posts");
        router.refresh();
      } else {
        setError(result.error || "Update failed. Please try again.");
      }
    } catch (err) {
      setError("Server error occurred during update.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/my-posts"
              className="p-2 hover:bg-gray-200 rounded-full transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Edit Post
            </h1>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <MaterialCard>
            {/* Title Input */}
            <input
              type="text"
              placeholder="Post Title"
              className="w-full text-4xl font-bold bg-transparent border-b border-gray-200 focus:border-primary outline-none py-4 mb-6 text-black transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Image Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-600 mb-3 ml-1">
                Cover Image
              </label>
              <div className="relative group">
                {image ? (
                  <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                    <img
                      src={image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-200">
                      <span className="text-white font-bold flex items-center gap-2 text-sm bg-black/50 px-4 py-2 rounded-full">
                        <ImagePlus className="w-4 h-4" /> Change Image
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-primary mb-2" />
                    <span className="text-sm font-medium text-gray-500 group-hover:text-primary">
                      Add Cover Image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div className="mb-6">
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-12 py-4 rounded-full font-bold shadow-m3-1 hover:shadow-m3-2 transform active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Story
                  </>
                )}
              </button>
            </div>
          </MaterialCard>
        </form>
      </div>
    </main>
  );
}
