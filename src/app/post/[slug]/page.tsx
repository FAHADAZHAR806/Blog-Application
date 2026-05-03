"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfessionalBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("User parse error");
      }
    }

    const fetchPostAndData = async () => {
      if (!slug) return;
      try {
        const res = await fetch(`/api/post/${slug}`);
        if (!res.ok) throw new Error("Post not found");
        const result = await res.json();
        const postData = result.data;

        setPost(postData);

        if (storedUser) {
          const u = JSON.parse(storedUser);
          setLiked(postData.likes?.includes(u.id || u._id));
        }

        const commentRes = await fetch(`/api/post/${slug}/comments`);
        if (commentRes.ok) {
          const commentResult = await commentRes.json();
          setComments(commentResult.data || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndData();
  }, [slug]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return alert("Please login to like this post");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/post/${slug}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        setLiked(result.data.liked);
        setPost((prev: any) => ({
          ...prev,
          likes: result.data.liked
            ? [...(prev.likes || []), user.id || user._id]
            : prev.likes.filter((id: string) => id !== (user.id || user._id)),
        }));
      }
    } catch (err) {
      console.error("Like failed");
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/post/${slug}/comments`, {
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!post)
    return (
      <div className="p-20 text-center text-2xl font-bold">Post Not Found</div>
    );

  return (
    <article className="min-h-screen bg-white pb-20">
      <header className="relative w-full h-[65vh] bg-gray-900">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6  ">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/90 font-medium">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white text-sm font-bold">
                {post.author?.name?.charAt(0)}
              </div>
              <span className="font-bold underline decoration-blue-500 underline-offset-4">
                {post.author?.name}
              </span>
              <span className="opacity-50">•</span>
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

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-12">
          <button
            onClick={(e) => handleLike(e)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all border ${
              liked
                ? "bg-red-50 border-red-100 text-red-500"
                : "bg-gray-50 border-gray-100 text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="text-xl">{liked ? "❤️" : "🤍"}</span>
            <span className="font-bold">{post.likes?.length || 0}</span>
          </button>
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <span>💬 {comments.length} Comments</span>
          </div>
        </div>

        <div
          className="prose prose-blue prose-lg md:prose-xl max-w-none mb-20 leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <section className="mt-20">
          <h2 className="text-3xl font-black mb-10 text-gray-900 flex items-center gap-3">
            The Conversation{" "}
            <span className="text-blue-600 text-lg font-medium">
              ({comments.length})
            </span>
          </h2>

          {user ? (
            <div className="mb-16 bg-gray-50 p-8 rounded-[2.5rem]">
              <form onSubmit={handlePostComment} className="space-y-4">
                <textarea
                  className="w-full p-6 rounded-3xl bg-white border border-gray-200 focus:border-blue-500 outline-none transition-all h-32 shadow-sm text-gray-800"
                  placeholder="What are your thoughts?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button
                  disabled={submitting}
                  className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Post Thought"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-blue-50 p-10 rounded-[2.5rem] text-center mb-16 border border-blue-100">
              <p className="text-blue-900 mb-4 font-bold">
                Sign in to join the discussion
              </p>
              <Link
                href="/login"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold"
              >
                Login Now
              </Link>
            </div>
          )}

          <div className="space-y-10">
            {comments.map((c: any) => (
              <div key={c._id} className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 border border-gray-200 uppercase">
                  {c.author?.name?.charAt(0)}
                </div>
                <div className="flex-1 border-b border-gray-50 pb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-extrabold text-gray-900">
                      {c.author?.name}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
