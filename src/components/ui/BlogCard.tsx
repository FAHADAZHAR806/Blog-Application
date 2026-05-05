import Link from "next/link";

interface BlogCardProps {
  post: any;
}

/**
 * WIX-INSPIRED EDITORIAL CARD:
 * Focuses on high-contrast imagery, deep rounded corners,
 * and clear information hierarchy.
 */
export default function BlogCard({ post }: BlogCardProps) {
  // Optimization: Pre-calculating the initials and dates to keep the JSX clean
  const authorInitial = post.author?.name?.charAt(0) || "L";
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/pages/post/${post.slug}`} className="group block h-full">
      <div
        className="
        relative flex flex-col h-full bg-white 
        rounded-[2.5rem] overflow-hidden 
        border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]
        group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] 
        group-hover:border-blue-100 
        transition-all duration-700 ease-out
      "
      >
        {/* IMAGE CONTAINER: Cinematic Reveal Effect */}
        <div className="relative h-64 w-full overflow-hidden bg-zinc-50">
          <img
            src={post.coverImage || "/placeholder-image.jpg"}
            alt={post.title}
            className="
              w-full h-full object-cover 
              transition-transform duration-1000 ease-in-out 
              group-hover:scale-110
            "
            loading="lazy"
          />

          {/* Subtle Overlay: Wix-style gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge: Floating Premium Style */}
          <div className="absolute top-6 left-6">
            <span
              className="
              bg-white/90 backdrop-blur-md px-4 py-1.5 
              rounded-full text-[10px] font-black uppercase tracking-[0.2em] 
              text-zinc-900 border border-white/50 shadow-sm
            "
            >
              {post.category || "Story"}
            </span>
          </div>
        </div>

        {/* CONTENT SECTION: Spaced-out and Minimalist */}
        <div className="p-8 flex flex-col flex-grow space-y-6">
          <div className="space-y-3">
            <h2
              className="
              text-2xl font-bold text-zinc-900 
              leading-[1.3] tracking-tight 
              group-hover:text-blue-600 transition-colors duration-300 
              line-clamp-2
            "
            >
              {post.title}
            </h2>

            {/* Optional Excerpt: Mimicking Wix's content density */}
            <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed font-medium">
              {post.content?.replace(/<[^>]*>/g, "").substring(0, 90)}...
            </p>
          </div>

          {/* AUTHOR FOOTER: Clean & Credible */}
          <div className="mt-auto pt-6 border-t border-zinc-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar with soft border */}
              <div
                className="
                h-10 w-10 rounded-full 
                bg-gradient-to-br from-blue-50 to-zinc-100 
                flex items-center justify-center 
                text-blue-600 font-black text-xs 
                border border-zinc-100
              "
              >
                {post.author?.profileImage ? (
                  <img
                    src={post.author.profileImage}
                    className="rounded-full object-cover w-full h-full"
                    alt="author"
                  />
                ) : (
                  authorInitial
                )}
              </div>

              <div className="flex flex-col -space-y-1">
                <span className="text-[13px] font-black text-zinc-900">
                  {post.author?.name || "Anonymous Creator"}
                </span>
                <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-tighter">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Interaction Indicator: Minimal dot to show 'activity' */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:animate-ping" />
              <span className="text-[10px] font-black text-zinc-300 group-hover:text-blue-500 transition-colors">
                READ
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
