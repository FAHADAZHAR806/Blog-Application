import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import MaterialCard from "@/components/ui/MaterialCard";
import Link from "next/link";
import User from "@/models/User";

async function getPosts() {
  await connectDB();

  // Model registration fix
  console.log("Registering model:", User.modelName);

  return await Post.find({ status: "published" })
    .populate({
      path: "author",
      model: User,
      select: "name",
    })
    .sort({ createdAt: -1 })
    .lean();
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-surface py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">
            The <span className="text-primary">Tactile</span> Feed
          </h1>
          <p className="text-secondary text-xl max-w-2xl font-medium opacity-80">
            A minimalist space for high-quality thoughts. Explore insights from
            our decentralized community.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <Link
                href={`/post/${post.slug}`}
                key={post._id.toString()}
                className="group"
              >
                <MaterialCard
                  elevation={0}
                  className="h-full flex flex-col border border-gray-100 overflow-hidden hover:border-primary/20 hover:shadow-m3-2 transition-all duration-300 rounded-3xl bg-white"
                >
                  {/* Post Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    <img
                      src={post.coverImage || "/placeholder-blog.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 line-clamp-3 mb-6 text-sm leading-relaxed">
                      {post.content?.replace(/<[^>]*>/g, "").substring(0, 120)}
                      ...
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                          {post.author?.name?.charAt(0) || "A"}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {post.author?.name || "Anonymous"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </MaterialCard>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="text-6xl mb-4">✍️</div>
              <p className="text-gray-500 text-xl font-medium">
                No tactile posts found yet.
              </p>
              <Link
                href="/dashboard/create"
                className="text-primary font-bold underline mt-2 block"
              >
                Be the first to write!
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
