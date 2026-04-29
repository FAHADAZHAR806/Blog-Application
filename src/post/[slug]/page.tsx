"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MaterialCard from "@/components/ui/MaterialCard";

interface Post {
  title: string;
  content: string;
  coverImage?: string;
  author: { name: string };
  createdAt: string;
}

export default function SinglePostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        const result = await res.json();
        if (res.ok) {
          setPost(result.data);
        }
      } catch (err) {
        console.error("Failed to load post", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  if (loading)
    return (
      <div className="p-20 text-center text-secondary animate-pulse font-bold">
        Unfolding your story...
      </div>
    );
  if (!post)
    return <div className="p-20 text-center text-red-500">Post not found.</div>;

  return (
    <main className="min-h-screen bg-surface p-4 md:p-8">
      <article className="max-w-3xl mx-auto">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="w-full h-64 md:h-96 rounded-[2rem] overflow-hidden mb-8 shadow-m3-2">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <MaterialCard elevation={1} className="p-8 md:p-12">
          <header className="mb-10 border-b border-surface-variant pb-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-m3-1">
                {post.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{post.author?.name}</p>
                <p className="text-sm text-secondary">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </header>

          {/* This is where TipTap content lives */}
          <div
            className="prose prose-lg md:prose-xl max-w-none 
                       prose-headings:text-gray-900 prose-headings:font-black
                       prose-p:text-gray-800 prose-p:leading-relaxed
                       prose-strong:text-primary prose-strong:font-bold
                       prose-img:rounded-3xl prose-img:shadow-lg
                       prose-a:text-primary prose-a:font-bold hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </MaterialCard>
      </article>
    </main>
  );
}
