"use client";

import { useEffect, useState, use, useCallback } from "react"; // ✅ useCallback
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image"; // ✅ next/image
import { fileToBase64 } from "@/lib/file-to-base64";
import { ImagePlus, Save, ArrowLeft, Loader2, X } from "lucide-react";
import Link from "next/link";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-50/50 animate-pulse rounded-[2.5rem] border border-dashed border-gray-100 flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
          Syncing Canvas...
        </span>
      </div>
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // ✅ Fetch by ID directly — no more fetching all posts and filtering
        const res = await fetch(`/api/post/${id}`);
        const json = await res.json();

        if (json.success && json.data) {
          setTitle(json.data.title || "");
          setContent(json.data.content || "");
          setImage(json.data.coverImage || null);
        } else {
          setError("This story could not be found.");
        }
      } catch {
        // ✅ Replaced "archive" with a cleaner message
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // ✅ useCallback: stable reference, no recreation on every render
  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const base64 = await fileToBase64(e.target.files[0]);
        setImage(base64);
      }
    },
    [],
  );

  // ✅ useCallback with deps — only recreates when title/content/image changes
  const handleUpdate = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!title) return;
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      try {
        const slug = title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        const res = await fetch(`/api/post`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id,
            title: title.trim(),
            content: content.trim(),
            coverImage: image,
            slug,
          }),
        });

        if (res.ok) {
          router.push("/dashboard/my-posts");
          router.refresh();
        } else {
          const result = await res.json();
          setError(result.error || "Failed to save your changes.");
        }
      } catch {
        setError("Couldn't reach the server. Check your connection.");
      } finally {
        setSaving(false);
      }
    },
    [id, title, content, image, router],
  );

  // ✅ Stable onChange — prevents RichTextEditor from re-mounting on each keystroke
  const handleContentChange = useCallback((val: string) => {
    setContent(val);
  }, []);

  // ✅ Pre-computed derived value — not inlined in JSX
  const canvasDepth = content.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 selection:bg-blue-50 selection:text-blue-600">
      {/* Editorial Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-50 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard/my-posts"
            className="group flex items-center gap-3 text-zinc-400 hover:text-black transition-all"
          >
            <div className="p-2 rounded-full border border-transparent group-hover:border-gray-100 group-hover:bg-gray-50">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">
              Discard Changes
            </span>
          </Link>

          <button
            onClick={() => handleUpdate()}
            disabled={saving || !title}
            className="bg-black text-white px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:opacity-10 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save size={14} />
                Update Story
              </>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-32">
        {error && (
          <div className="mb-12 p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-xs font-black uppercase tracking-widest flex items-center gap-3">
            <X size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          {/* Cinematic Image Preview */}
          <section className="mb-16">
            <div className="relative group h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-700 bg-gray-50 border border-gray-100">
              {image ? (
                <>
                  {/* ✅ next/image replaces <img> */}
                  <Image
                    src={image}
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <label className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all bg-black/20 backdrop-blur-sm">
                    <div className="bg-white px-8 py-3 rounded-full flex items-center gap-2 shadow-2xl">
                      <ImagePlus size={18} className="text-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Replace Visual
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer group hover:bg-gray-100/50 transition-all">
                  <div className="p-6 rounded-[2.5rem] bg-white shadow-xl mb-4 group-hover:scale-110 transition-transform">
                    <ImagePlus
                      size={32}
                      className="text-zinc-200 group-hover:text-black transition-colors"
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-black">
                    Add Cover Art
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
          </section>

          {/* Dynamic Title */}
          <div className="mb-10 space-y-8">
            <textarea
              rows={1}
              placeholder="Title..."
              className="w-full text-2xl md:text-3xl font-black bg-transparent border-none outline-none placeholder:text-gray-100 tracking-[-0.05em] resize-none overflow-hidden leading-[0.9]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onInput={(e) => {
                e.currentTarget.style.height = "50px";
                e.currentTarget.style.height =
                  e.currentTarget.scrollHeight + "px";
              }}
            />

            <div className="flex items-center gap-8 py-8 border-y border-gray-50">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300 mb-1">
                  Status
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">
                    Published
                  </span>
                </div>
              </div>
              <div className="w-[1px] h-8 bg-gray-50" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300 mb-1">
                  Canvas Depth
                </span>
                {/* ✅ Pre-computed derived value */}
                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">
                  {canvasDepth} units
                </span>
              </div>
            </div>
          </div>

          {/* Editor Canvas */}
          <div className="prose prose-zinc prose-2xl max-w-none pt-4">
            {/* ✅ Stable callback — prevents unnecessary re-mounts */}
            <RichTextEditor content={content} onChange={handleContentChange} />
          </div>
        </form>
      </div>
    </main>
  );
}
