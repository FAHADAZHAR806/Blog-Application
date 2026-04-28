import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";

export default async function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  await connectDB();
  const post = await Post.findOne({ slug: params.slug }).populate(
    "author",
    "name",
  );

  if (!post) notFound();

  return (
    <article className="min-h-screen bg-surface py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Cover Image */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            className="w-full h-[400px] object-cover rounded-md-3 shadow-m3-2 mb-8"
            alt={post.title}
          />
        )}

        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-secondary">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {post.author.name[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900">{post.author.name}</p>
              <p className="text-sm">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content (using Tailwind Typography) */}
        <div
          className="prose prose-lg prose-purple max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
