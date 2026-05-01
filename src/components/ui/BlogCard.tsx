import Link from "next/link";

interface BlogCardProps {
  post: any;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/post/${post.slug}`}>
      <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={post.coverImage || "/placeholder-image.jpg"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          <div className="mt-auto flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {post.author?.name?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                {post.author?.name || "Anonymous"}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
