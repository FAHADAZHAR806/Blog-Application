"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MaterialCard from "@/components/ui/MaterialCard";
import { Trash2, Edit3, Eye } from "lucide-react";

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/user/post", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setPosts(json.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/post/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setPosts(posts.filter((p: any) => p._id !== id));
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-900">My Tactile Posts</h1>
        <Link
          href="/dashboard/create"
          className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-all"
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 w-full bg-gray-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-4">
          {posts.map((post: any) => (
            <MaterialCard
              key={post._id}
              className="flex items-center justify-between p-6 hover:border-primary/20 transition-all"
            >
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-900">
                  {post.title}
                </h2>
                <span className="text-sm text-gray-500">
                  Status:{" "}
                  <span className="capitalize font-medium text-primary">
                    {post.status}
                  </span>{" "}
                  • Published on {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/post/${post.slug}`}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                  title="View"
                >
                  <Eye size={20} />
                </Link>
                <Link
                  href={`/dashboard/edit/${post._id}`}
                  className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit3 size={20} />
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-2 hover:bg-red-50 rounded-full text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </MaterialCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">
            You haven't written any posts yet.
          </p>
        </div>
      )}
    </div>
  );
}
