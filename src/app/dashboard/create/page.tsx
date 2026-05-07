"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { fileToBase64 } from "@/lib/file-to-base64";
import {
  Sparkles,
  Loader2,
  X,
  ArrowLeft,
  Image as ImageIcon,
  Zap,
} from "lucide-react";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-50/30 animate-pulse rounded-[2rem] border border-dashed border-gray-100 flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
          Initializing Canvas...
        </span>
      </div>
    ),
  },
);

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/pages/login");
  }, [router]);

  const handleAIGenerate = useCallback(async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const result = await res.json();
      if (result.success) {
        setTitle(result.data.title);
        setContent(result.data.content);
        setImage(result.data.image);
        setAiPrompt("");
      }
    } catch {
      console.error("AI Generation failed");
    } finally {
      setAiLoading(false);
    }
  }, [aiPrompt]);

  const handleSubmit = useCallback(async () => {
    if (!title || !content) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      // ✅ Safe parse — won't throw on null/corrupt data
      const parsedUser = userString ? JSON.parse(userString) : null;
      if (!parsedUser) return router.push("/pages/login");

      const postRes = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          coverImage: image,
          author: parsedUser._id || parsedUser.id,
          status: "published",
          // ✅ More robust slug: strips leading/trailing dashes
          slug: title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
        }),
      });

      if (postRes.ok) router.push("/");
    } catch {
      alert("Error saving your masterpiece");
    } finally {
      setLoading(false);
    }
  }, [title, content, image, router]);

  // ✅ Stable onChange for RichTextEditor — prevents unnecessary re-mounts
  const handleContentChange = useCallback((val: string) => {
    setContent(val);
  }, []);

  // ✅ Derived values — computed once per render, not inlined in JSX
  const wordCount = content
    .replace(/<[^>]*>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  const complexity = content.length > 500 ? "In-depth" : "Quick Read";

  return (
    <main className="min-h-screen bg-white text-zinc-900 selection:bg-blue-50 selection:text-blue-600">
      {/* Top Professional Toolbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-50 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-zinc-400 hover:text-black transition-all"
          >
            <div className="p-2 rounded-full border border-transparent group-hover:border-gray-100 group-hover:bg-gray-50">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">
              Exit
            </span>
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Auto-Save
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !title}
              className="bg-black text-white px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:opacity-10 transition-all hover:scale-105 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "Publish Story"
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-32">
        {/* AI Co-Pilot Input */}
        <section className="mb-20">
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-white border border-gray-100 rounded-[2rem] p-1.5 flex items-center shadow-sm">
              <div className="pl-5 text-blue-500">
                <Sparkles size={20} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Give me a theme, I'll write the rest..."
                className="flex-1 bg-transparent px-5 py-4 outline-none text-sm font-bold placeholder:text-zinc-300"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAIGenerate()}
              />
              <button
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiPrompt}
                className="bg-gray-900 text-white p-4 rounded-[1.6rem] hover:bg-blue-600 transition-all disabled:opacity-20 flex items-center gap-2"
              >
                {aiLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Zap size={18} fill="white" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Cinematic Media Area */}
        <section className="mb-16">
          {image ? (
            <div className="relative group h-[550px] rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
              {/* ✅ next/image replaces <img> */}
              <Image
                src={image}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt="Cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <button
                onClick={() => setImage(null)}
                className="absolute top-10 right-10 z-10 bg-white/20 backdrop-blur-xl p-4 rounded-full text-white hover:bg-white hover:text-red-500 transition-all border border-white/20"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-[400px] border-2 border-dashed border-gray-100 rounded-[3.5rem] cursor-pointer hover:bg-gray-50/50 hover:border-gray-300 transition-all group bg-gray-50/20">
              <div className="flex flex-col items-center gap-6">
                <div className="p-6 rounded-[2.5rem] bg-white shadow-xl shadow-gray-100 group-hover:scale-110 transition-transform">
                  <ImageIcon
                    size={32}
                    className="text-zinc-200 group-hover:text-black transition-colors"
                  />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 group-hover:text-black">
                    Add Cinematic Cover
                  </p>
                  <p className="text-[9px] font-bold text-zinc-300 mt-2">
                    Recommended: 16:9 High-Res
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*" // ✅ Restricts picker to images only
                className="hidden"
                onChange={async (e) => {
                  if (e.target.files?.[0])
                    setImage(await fileToBase64(e.target.files[0]));
                }}
              />
            </label>
          )}
        </section>

        {/* Editor Canvas */}
        <div className="space-y-10">
          <textarea
            rows={1}
            placeholder="Title of your story..."
            className="w-full text-2xl md:text-3xl font-black bg-transparent border-none outline-none placeholder:text-gray-100 tracking-[-0.05em] resize-none overflow-hidden leading-[0.9]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ height: "50px" }}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height =
                e.currentTarget.scrollHeight + "px";
            }}
          />

          <div className="flex items-center gap-8 py-8 border-y border-gray-50">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300 mb-1">
                Metrics
              </span>
              {/* ✅ Pre-computed derived value */}
              <span className="text-[10px] font-black text-zinc-900">
                {wordCount} Words
              </span>
            </div>
            <div className="w-[1px] h-8 bg-gray-50" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300 mb-1">
                Complexity
              </span>
              {/* ✅ Pre-computed derived value */}
              <span className="text-[10px] font-black text-zinc-900">
                {complexity}
              </span>
            </div>
          </div>

          <div className="prose prose-zinc prose-2xl max-w-none">
            {/* ✅ Stable callback prevents RichTextEditor from re-mounting */}
            <RichTextEditor content={content} onChange={handleContentChange} />
          </div>
        </div>
      </div>
    </main>
  );
}
