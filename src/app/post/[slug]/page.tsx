"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image"; // Next.js Image component for optimization

export default function ProfessionalBlogPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const res = await fetch(`/api/post/${slug}`);
        const result = await res.json();
        if (res.ok) setPost(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!post)
    return (
      <div className="p-20 text-center text-2xl font-bold">Post Not Found</div>
    );

  return (
    <article className="min-h-screen bg-white">
      {/* 1. Full-Width Hero Section */}
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

        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="max-w-4xl">
            <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase mb-4 inline-block">
              {post.category || "Lifestyle"}
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-gray-200 font-medium">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
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

      {/* 2. Blog Content Body */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Intro / Excerpt */}
        <p className="text-xl md:text-2xl text-gray-600 italic leading-relaxed mb-12 border-l-4 border-primary pl-6">
          Everything you need to know about {post.title} and the impact it has
          on our daily digital workflows.
        </p>

        {/* The Real Content (Rendered from Editor) */}
        <div
          className="prose prose-lg md:prose-xl prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-700 prose-img:rounded-3xl prose-img:shadow-2xl prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* 3. Tags & Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag: string) => (
              <span
                key={tag}
                className="bg-gray-100 px-3 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </article>
  );
}
