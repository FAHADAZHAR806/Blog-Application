import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import MaterialCard from "@/components/ui/MaterialCard";
import Link from "next/link";
import User from "@/models/User"; // Keep this import

async function getPosts() {
  await connectDB();

  // FORCE REGISTRATION:
  // Accessing User.modelName tells the engine "I am definitely using this file"
  // This prevents the MissingSchemaError.
  console.log("Registering model:", User.modelName);

  return await Post.find({ status: "published" })
    .populate({
      path: "author",
      model: User, // <--- EXPLICITLY pass the model object here
      select: "name",
    })
    .sort({ createdAt: -1 })
    .lean(); // Lean makes it a plain object, better for Next.js
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          The <span className="text-primary font-bold">Tactile</span> Feed
        </h1>
        <p className="text-secondary text-lg font-medium">
          Your decentralized printing press.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <Link href={`/post/${post.slug}`} key={post._id.toString()}>
              <MaterialCard
                elevation={1}
                className="h-full hover:shadow-m3-2 transition-all"
              >
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <div className="text-secondary line-clamp-3 mb-4">
                  {/* Clean up HTML tags for the preview */}
                  {post.content?.replace(/<[^>]*>/g, "").substring(0, 100)}...
                </div>
                <div className="text-xs font-bold text-primary uppercase mt-auto">
                  By {post.author?.name || "Anonymous"}
                </div>
              </MaterialCard>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-secondary italic">
              No tactile posts found. Be the first to write!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
