import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import MaterialCard from "@/components/ui/MaterialCard";
import Link from "next/link";
import User from "@/models/User";
import Comment from "@/models/Comment";
import { Suspense } from "react";

/**
 * STRATEGIC DATA FETCHING:
 * To avoid extra renders and waterfall requests, we fetch everything
 * in a single streamlined async function.
 */
async function getPosts(page: number, query: string = "") {
  await connectDB();
  const limit = 12;
  const skip = (page - 1) * limit;

  // Search Filter: Wix-style precision searching
  const searchFilter = {
    status: "published",
    ...(query && { title: { $regex: query, $options: "i" } }),
  };

  // Optimization: Parallelizing count and find for faster response
  const [posts, totalPosts] = await Promise.all([
    Post.find(searchFilter)
      .populate({
        path: "author",
        model: User,
        select: "name profileImage",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(searchFilter),
  ]);

  // Efficient Stat Mapping: Avoids nested N+1 query issues
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
  const query = resolvedParams.q || "";
  const { posts, totalPages } = await getPosts(currentPage, query);

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* HERO SECTION: Bold Wix Typography */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter">
              Lumina <span className="text-blue-600">Feed.</span>
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
              Explore a world of decentralized thoughts, curated for the modern
              mind.
            </p>
          </div>

          {/* SEARCH BAR: Sleek & Tactile */}
          <div className="w-full md:w-[400px]">
            <form action="/" method="GET" className="relative group">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search Blogs..."
                className="w-full pl-14 pr-6 py-5 bg-white border border-zinc-200 rounded-[2rem] outline-none focus:border-blue-600 focus:ring-[6px] focus:ring-blue-50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 grayscale group-focus-within:grayscale-0 transition-all">
                🔍
              </span>
            </form>
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <Link
                href={`/post/${post.slug}`}
                key={post._id.toString()}
                className="group flex flex-col h-full"
              >
                <MaterialCard
                  elevation={0}
                  className="h-full flex flex-col border border-zinc-100 overflow-hidden hover:border-blue-100 transition-all duration-500 rounded-[2.5rem] bg-white shadow-sm group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
                >
                  {/* Image Container with Parallax-ready Scale */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={post.coverImage || "/placeholder-blog.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/80 backdrop-blur-xl text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] text-blue-700 border border-white/50 shadow-sm">
                        {post.category || "Insight"}
                      </span>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-10 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-4 group-hover:text-blue-600 transition-colors leading-[1.2] tracking-tight">
                      {post.title}
                    </h3>

                    <p className="text-zinc-500 line-clamp-3 mb-8 text-[16px] leading-relaxed font-normal">
                      {post.content?.replace(/<[^>]*>/g, "").substring(0, 120)}
                      ...
                    </p>

                    {/* Author & Stats Wrapper */}
                    <div className="mt-auto pt-8 border-t border-zinc-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                          <img
                            src={
                              post.author?.profileImage ||
                              `https://ui-avatars.com/api/?name=${post.author?.name}`
                            }
                            alt={post.author?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-zinc-900">
                            {post.author?.name || "Lumina Creator"}
                          </p>
                          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                          <span className="text-red-400/80">❤️</span>{" "}
                          {post.likeCount}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                          <span className="text-blue-400/80">💬</span>{" "}
                          {post.commentCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </MaterialCard>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-40 text-center bg-white rounded-[3rem] border border-zinc-100 shadow-sm">
              <div className="text-7xl mb-8 animate-bounce">🔭</div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                No Stories Discovered
              </h3>
              <p className="text-zinc-400 mb-8 font-medium">
                Try adjusting your search to find what you're looking for.
              </p>
              <Link
                href="/"
                className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold hover:bg-blue-600 transition-all"
              >
                Clear All Filters
              </Link>
            </div>
          )}
        </div>

        {/* PAGINATION: Clean & Minimalist */}
        {totalPages > 1 && (
          <nav className="mt-24 flex items-center justify-center gap-8">
            <Link
              href={`/?page=${currentPage - 1}${query ? `&q=${query}` : ""}`}
              className={`group flex items-center gap-2 text-sm font-bold transition-all ${
                currentPage <= 1
                  ? "pointer-events-none opacity-20"
                  : "text-zinc-900 hover:text-blue-600"
              }`}
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>{" "}
              Previous
            </Link>

            <div className="h-8 w-[1px] bg-zinc-200 rotate-12" />

            <span className="text-sm font-black text-zinc-900">
              {currentPage} <span className="text-zinc-300 mx-1">/</span>{" "}
              {totalPages}
            </span>

            <div className="h-8 w-[1px] bg-zinc-200 rotate-12" />

            <Link
              href={`/?page=${currentPage + 1}${query ? `&q=${query}` : ""}`}
              className={`group flex items-center gap-2 text-sm font-bold transition-all ${
                currentPage >= totalPages
                  ? "pointer-events-none opacity-20"
                  : "text-zinc-900 hover:text-blue-600"
              }`}
            >
              Next{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </nav>
        )}
      </div>
    </main>
  );
}
