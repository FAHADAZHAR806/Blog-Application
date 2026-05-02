"use client";

import { useEffect, useState, use } from "react"; // added use for params
import Image from "next/image";
import Link from "next/link";
import MaterialCard from "@/components/ui/MaterialCard";

export default function ProfessionalBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 15+ mein params ko 'use' hook se unwrap karna best practice hai
  const { slug } = use(params);

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("User parse error");
      }
    }

    const fetchPostAndComments = async () => {
      if (!slug) return;
      try {
        const res = await fetch(`/api/post/${slug}`);

        // Error handling for empty or non-ok responses
        if (!res.ok) throw new Error("Post not found");

        const text = await res.text();
        if (!text) throw new Error("Empty response from server");

        const result = JSON.parse(text);
        setPost(result.data);

        // Fetch comments only if post exists
        if (result.data?._id) {
          fetchComments(result.data._id);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [slug]);

  const fetchComments = async (postId: string) => {
    try {
      const res = await fetch(`/api/post/${postId}/comments`);
      if (!res.ok) return;
      const result = await res.json();
      setComments(result.data || []);
    } catch (err) {
      console.error("Comments fetch error:", err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/post/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) throw new Error("Failed to post");

      const result = await res.json();
      setComments((prev) => [result.data, ...prev]);
      setNewComment("");
    } catch (err) {
      alert("Failed to post comment. Make sure you are logged in.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold animate-pulse text-primary">
        Loading Post...
      </div>
    );
  if (!post)
    return (
      <div className="p-20 text-center text-2xl font-bold">Post Not Found</div>
    );

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* 1. Hero Section */}
      <header className="relative w-full h-[60vh] md:h-[70vh] bg-black">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="max-w-4xl">
            <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase mb-4 inline-block">
              {post.category || "Lifestyle"}
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-gray-200 font-medium">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border border-white/30 text-white font-bold">
                {post.author?.name?.charAt(0)}
              </div>
              <span>
                By{" "}
                <span className="text-white font-bold">
                  {post.author?.name}
                </span>
              </span>
              <span className="w-1 h-1 bg-white rounded-full" />
              <span>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Blog Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xl md:text-2xl text-gray-600 italic leading-relaxed mb-12 border-l-4 border-primary pl-6">
          Everything you need to know about {post.title}.
        </p>

        <div
          className="prose prose-lg md:prose-xl prose-headings:font-black prose-p:text-gray-700 mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* 3. Comments Section */}
        <section className="mt-20 pt-10 border-t border-gray-200">
          <h2 className="text-3xl font-black mb-8 text-gray-900">
            Discussions ({comments.length})
          </h2>

          {user ? (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="font-bold text-gray-700">
                  Commenting as {user.name}
                </span>
              </div>
              <form onSubmit={handlePostComment} className="space-y-4">
                <textarea
                  className="w-full p-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all h-32 shadow-inner"
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button
                  disabled={submitting}
                  className="bg-primary text-white px-10 py-3 rounded-full font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 p-10 rounded-[2rem] text-center mb-12 border-2 border-dashed border-gray-200">
              <p className="text-gray-600 mb-4 font-medium">
                Join the discussion to share your perspective.
              </p>
              <Link
                href="/login"
                className="inline-block bg-white border border-gray-300 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                Login to Comment
              </Link>
            </div>
          )}

          <div className="space-y-8">
            {comments.length > 0 ? (
              comments.map((c: any) => (
                <div key={c._id} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                    {c.author?.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 p-6 rounded-3xl rounded-tl-none group-hover:bg-gray-100/50 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-gray-900">
                          {c.author?.name}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(c.createdAt).toLocaleDateString(undefined, {
                            dateStyle: "medium",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {c.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-10">
                No comments yet. Be the first to start the conversation!
              </p>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
