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
        console.error(err);
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
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary/50" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 bg-[#FAFAFE] min-h-screen">
      {/* Header Section */}
      <div className="relative mb-12 p-8 rounded-[40px] bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
              My <span className="text-primary">Stories</span>
            </h1>
            <p className="text-gray-500 font-medium">
              Manage, refine, and track your publications.
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-3xl font-bold hover:bg-primary transition-all shadow-xl hover:shadow-primary/20 active:scale-95"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            Create New
          </Link>
        </div>
        {/* Background Decorative Circle */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Posts List */}
      <div className="grid gap-8">
        {posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No stories yet</h3>
            <p className="text-gray-500 mb-6">
              Your creative journey starts here.
            </p>
          </div>
        ) : (
          posts.map((post: any) => (
            <div
              key={post._id}
              className="group relative transition-all duration-300"
            >
              <MaterialCard>
                <div className="flex flex-col lg:flex-row gap-8 p-2">
                  {/* Image with Overlay */}
                  <div className="relative w-full lg:w-64 h-44 shrink-0 overflow-hidden rounded-[24px] bg-gray-100">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt="cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 font-bold">
                        NO IMAGE
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-sm">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                        {post.status || "Live"}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900 group-hover:text-primary transition-colors mb-3 line-clamp-2">
                        {post.title}
                      </h2>
                      <div className="flex flex-wrap gap-5 text-gray-400">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Eye className="w-4 h-4" />
                          {post.views || 0} Views
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/edit/${post._id}`}
                          className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-2xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                        >
                          <Edit3 className="w-4 h-4" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>

                      <Link
                        href={`/post/${post.slug}`}
                        className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-black hover:text-white transition-all"
                        title="View Live Story"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </MaterialCard>
              {/* Subtle accent border on hover */}
              <div className="absolute -inset-0.5 border-2 border-primary/0 group-hover:border-primary/10 rounded-[34px] -z-10 transition-all pointer-events-none"></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
