"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  ArrowLeft,
  Share2,
  MoreHorizontal,
} from "lucide-react";

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
        setUser(JSON.parse(storedUser));
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
      const result = await res.json();
      const commentWithAuthor = {
        ...result.data,
        author: {
          _id: user.id || user._id,
          name: user.name,
          profileImage: user.profileImage,
        },
      };
      setComments((prev) => [commentWithAuthor, ...prev]);
      setNewComment("");
    } catch (err) {
      alert("Login required to comment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-[3px] border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <article className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 font-black text-sm uppercase tracking-tighter hover:opacity-70 transition-all"
        >
          <ArrowLeft size={16} /> Back to Feed
        </Link>
        <div className="flex gap-4">
          <Share2 size={18} className="cursor-pointer hover:text-blue-600" />
          <MoreHorizontal size={18} className="cursor-pointer" />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              Editorial
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {Math.ceil((post.content?.length || 0) / 1000)} min read
            </span>
          </div>

          <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-black leading-[0.95] tracking-[-0.04em] text-gray-900 mb-10">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 py-8 border-t border-gray-100">
            <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
              <img
                src={
                  post.author?.profileImage ||
                  `https://ui-avatars.com/api/?name=${post.author?.name}`
                }
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg leading-none">
                {post.author?.name}
              </p>
              <p className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-tighter">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="px-6 mb-20">
          <div className="max-w-7xl mx-auto h-[70vh] relative rounded-[40px] overflow-hidden shadow-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-3xl mx-auto px-6">
        <div
          className="prose prose-lg md:prose-2xl prose-headings:font-black prose-headings:tracking-tighter prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:tracking-[-0.01em] max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Interaction Bar */}
        <div className="flex items-center justify-between py-12 mt-20 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 group transition-all"
            >
              <div
                className={`p-3 rounded-full transition-all ${liked ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"}`}
              >
                <Heart
                  size={24}
                  fill={liked ? "currentColor" : "none"}
                  strokeWidth={2.5}
                />
              </div>
              <span className="font-black text-xl">
                {post.likes?.length || 0}
              </span>
            </button>
            <div className="flex items-center gap-2 text-gray-400 font-black">
              <MessageSquare size={24} strokeWidth={2.5} />
              <span className="text-xl">{comments.length}</span>
            </div>
          </div>
        </div>

        {/* Conversation Section */}
        <section className="pb-32">
          <h2 className="text-4xl font-black tracking-tighter mb-12 text-gray-900">
            The Discussion
          </h2>

          {user ? (
            <div className="mb-20">
              <form onSubmit={handlePostComment} className="relative">
                <textarea
                  className="w-full p-8 rounded-[32px] bg-gray-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all h-40 font-bold text-lg placeholder:text-gray-300"
                  placeholder="Share your perspective..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button
                  disabled={submitting}
                  className="absolute bottom-6 right-6 bg-black text-white px-8 py-3 rounded-full font-black hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "..." : "Post Thought"}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-12 rounded-[40px] bg-gray-50 text-center mb-20 border-2 border-dashed border-gray-200">
              <p className="font-black text-xl mb-6">
                Login to join the conversation
              </p>
              <Link
                href="/pages/login"
                className="bg-black text-white px-10 py-4 rounded-full font-black"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-12">
            {comments.map((c: any) => (
              <div key={c._id} className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                  <img
                    src={
                      c.author?.profileImage ||
                      `https://ui-avatars.com/api/?name=${c.author?.name}`
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 border-b border-gray-50 pb-10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-gray-900 text-lg uppercase tracking-tight">
                      {c.author?.name}
                    </span>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
