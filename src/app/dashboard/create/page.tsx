"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { fileToBase64 } from "@/lib/file-to-base64";
import {
  Sparkles,
  Loader2,
  Wand2,
  X,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-50/50 animate-pulse rounded-3xl border border-gray-100" />
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

  const handleAIGenerate = async () => {
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
    } catch (err) {
      console.error("AI Error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      const parsedUser = JSON.parse(userString!);

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
          slug: title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-"),
        }),
      });

      if (postRes.ok) router.push("/");
    } catch (err) {
      alert("Error saving post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-zinc-200">
      {/* Top Navigation - Floating Style */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-medium uppercase tracking-widest">
              Back
            </span>
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
              Drafting Mode
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading || !title}
              className="bg-zinc-900 text-white px-8 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-20 transition-all shadow-xl shadow-zinc-200"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Publish Story"
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        {/* AI Creative Assistant Section */}
        <section className="mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-100 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white border border-zinc-100 rounded-[1.5rem] p-2 flex items-center shadow-sm">
              <div className="pl-4">
                <Sparkles className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="What's on your mind? Let AI weave the story..."
                className="flex-1 bg-transparent px-4 py-4 outline-none text-sm font-medium placeholder:text-zinc-300"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAIGenerate()}
              />
              <button
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiPrompt}
                className="bg-zinc-900 text-white px-6 py-3 rounded-[1.2rem] hover:scale-[0.98] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Generate
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Cinematic Cover Image */}
        <section className="mb-12">
          {image ? (
            <div className="relative group h-[500px] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700">
              <img
                src={image}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Cover"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <button
                onClick={() => setImage(null)}
                className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-3 rounded-full hover:bg-white hover:text-red-500 shadow-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border border-dashed border-zinc-200 rounded-[3rem] cursor-pointer hover:bg-zinc-50 hover:border-zinc-400 transition-all group">
              <div className="flex flex-col items-center gap-4 text-zinc-400 group-hover:text-zinc-900">
                <div className="p-4 rounded-full bg-zinc-50 group-hover:bg-white shadow-sm transition-colors">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                  Cinematic Cover
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={async (e) => {
                  if (e.target.files?.[0])
                    setImage(await fileToBase64(e.target.files[0]));
                }}
              />
            </label>
          )}
        </section>

        {/* Content Section */}
        <div className="space-y-6">
          <textarea
            rows={1}
            placeholder="The Title of Your Masterpiece"
            className="w-full text-5xl md:text-7xl font-bold bg-transparent border-none outline-none placeholder:text-zinc-100 tracking-tighter resize-none overflow-hidden"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ height: "auto" }}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height =
                e.currentTarget.scrollHeight + "px";
            }}
          />

          <div className="flex items-center gap-6 py-6 border-y border-zinc-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Live Editor
              </span>
            </div>
            <div className="h-4 w-[1px] bg-zinc-100" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {content.replace(/<[^>]*>/g, "").length} Characters
            </span>
          </div>

          {/* Fixed Rich Text Editor Container */}
          <div className="prose prose-zinc prose-lg max-w-none pt-8">
            <RichTextEditor
              content={content}
              onChange={(val: string) => setContent(val)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
