import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import MaterialCard from "@/components/ui/MaterialCard";
import Link from "next/link";
import User from "@/models/User";
import Comment from "@/models/Comment";
import SearchInput from "@/components/ui/SearchInput"; // Ek naya client component (niche code diya hai)

async function getPosts(page: number, query: string = "") {
  await connectDB();
  const limit = 12;
  const skip = (page - 1) * limit;

  if (!User.modelName) console.log("Registering model...");

  // Search Filter: Agar query hai toh title mein search karega (case-insensitive)
  const searchFilter = {
    status: "published",
    ...(query && { title: { $regex: query, $options: "i" } }),
  };

  const posts = await Post.find(searchFilter)
    .populate({
      path: "author",
      model: User,
      select: "name profileImage",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalPosts = await Post.countDocuments(searchFilter);

  const postsWithStats = await Promise.all(
    posts.map(async (post: any) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post,
        commentCount,
        likeCount: post.likes?.length || 0,
      };
    }),
  );

  return {
    posts: postsWithStats,
    totalPages: Math.ceil(totalPosts / limit),
    currentPage: page,
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const query = resolvedParams.q || ""; // URL se search query pakri
  const { posts, totalPages } = await getPosts(currentPage, query);

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Lumina <span className="text-blue-600">Feed.</span>
            </h2>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
              A minimalist space for high-quality thoughts. Explore insights
              from our decentralized community.
            </p>
          </div>

          {/* Search Bar Implementation */}
          <div className="w-full md:w-96">
            <form action="/" method="GET" className="relative group">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search stories by title..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40">
                🔍
              </span>
            </form>
          </div>
        </header>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <Link
                href={`/pages/post/${post.slug}`}
                key={post._id.toString()}
                className="group"
              >
                <MaterialCard
                  elevation={0}
                  className="h-full flex flex-col border border-gray-200 overflow-hidden hover:border-blue-200 transition-all duration-300 rounded-[2rem] bg-white shadow-sm hover:shadow-md"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-gray-50">
                    <img
                      src={post.coverImage || "/placeholder-blog.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest text-blue-600 border border-blue-50">
                        {post.category || "Insight"}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-gray-500 line-clamp-3 mb-8 text-[15px] leading-relaxed">
                      {post.content?.replace(/<[^>]*>/g, "").substring(0, 110)}
                      ...
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {post.author?.name?.charAt(0) || "A"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 leading-none">
                            {post.author?.name || "Anonymous"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium mt-1">
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 text-gray-400">
                        <div className="flex items-center gap-1 text-[12px] font-semibold">
                          <span>❤️</span> <span>{post.likeCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[12px] font-semibold">
                          <span>💬</span> <span>{post.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </MaterialCard>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="text-6xl mb-6">🔍</div>
              <p className="text-gray-500 text-xl font-semibold">
                {query
                  ? `No stories found for "${query}"`
                  : "No stories found in the feed."}
              </p>
              <Link
                href="/"
                className="text-blue-600 font-bold hover:underline mt-4 inline-block"
              >
                Clear search and see all stories
              </Link>
            </div>
          )}
        </div>

        {/* Professional Pagination Buttons (Updated for Search) */}
        {totalPages > 1 && (
          <div className="mt-20 flex items-center justify-center gap-6">
            <Link
              href={`/?page=${currentPage - 1}${query ? `&q=${query}` : ""}`}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all border ${
                currentPage <= 1
                  ? "pointer-events-none opacity-20 border-gray-200"
                  : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
              }`}
            >
              Previous
            </Link>

            <span className="text-sm font-bold text-gray-400">
              <span className="text-gray-900">{currentPage}</span> /{" "}
              {totalPages}
            </span>

            <Link
              href={`/?page=${currentPage + 1}${query ? `&q=${query}` : ""}`}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all border ${
                currentPage >= totalPages
                  ? "pointer-events-none opacity-20 border-gray-200"
                  : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
              }`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
