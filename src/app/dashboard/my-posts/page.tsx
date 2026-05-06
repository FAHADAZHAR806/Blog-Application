"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Edit3,
  Trash2,
  ExternalLink,
  Loader2,
  Plus,
  FileText,
  Calendar,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import MaterialCard from "@/components/ui/MaterialCard";

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) return;
        const user = JSON.parse(userData);
        const userId = user.id || user._id;

        const res = await fetch("/api/post?adminView=true");
        const json = await res.json();

        if (json.success) {
          const myData = json.data.filter(
            (post: any) => (post.author?._id || post.author) === userId,
          );
          setPosts(myData);
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      const res = await fetch(`/api/post?id=${id}`, { method: "DELETE" });
      if (res.ok) setPosts(posts.filter((p: any) => p._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white">
        <div className="w-12 h-12 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white min-h-screen selection:bg-zinc-100">
      {/* Header: Editorial Style */}
      <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-zinc-50 pb-12">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-4">
            Archive <span className="text-zinc-200">/</span> 01
          </h1>
          <p className="text-zinc-400 text-xs font-black uppercase tracking-[0.3em]">
            Manage your published narratives and creative insights.
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="group flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-zinc-200"
        >
          <Plus
            size={16}
            strokeWidth={3}
            className="group-hover:rotate-90 transition-transform"
          />
          Create New Story
        </Link>
      </header>

      {/* Stories Grid */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-32 bg-zinc-50/50 rounded-[3rem] border border-dashed border-zinc-100">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FileText className="w-8 h-8 text-zinc-200" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-2">
              No Stories Found
            </h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-8">
              Begin your journey with the plus button above.
            </p>
          </div>
        ) : (
          posts.map((post: any) => (
            <div
              key={post._id}
              className="group relative transition-all duration-500"
            >
              <MaterialCard>
                <div className="flex flex-col lg:flex-row gap-10 p-3">
                  {/* Cinematic Thumbnail */}
                  <div className="relative w-full lg:w-72 h-48 shrink-0 overflow-hidden rounded-[2.5rem] bg-zinc-50 border border-zinc-100">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        alt={post.title}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[10px] font-black tracking-widest text-zinc-300">
                        EMPTY CANVAS
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-xl rounded-full border border-white/20 shadow-sm">
                      <span className="text-[8px] font-black uppercase tracking-widest text-black">
                        {post.status || "Published"}
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-zinc-200" />
                        <div className="flex items-center gap-1.5">
                          <Eye size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {post.views || 0} Reads
                          </span>
                        </div>
                      </div>
                      <h2 className="text-3xl font-black text-black tracking-tighter leading-tight group-hover:text-zinc-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-50">
                      <div className="flex gap-3">
                        <Link
                          href={`/dashboard/edit/${post._id}`}
                          className="flex items-center gap-2 px-6 py-2.5 bg-zinc-50 text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                        >
                          <Edit3 size={12} /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-red-50/50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>

                      <Link
                        href={`/post/${post.slug}`}
                        target="_blank"
                        className="w-11 h-11 bg-zinc-50 text-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all"
                      >
                        <ArrowUpRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </MaterialCard>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
