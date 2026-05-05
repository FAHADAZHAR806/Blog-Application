"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      // Redirecting to search results page
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);

      // Reset loading state after a short delay or navigation
      setTimeout(() => setIsSearching(false), 2000);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-[300px] group"
    >
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search Blogs..."
          className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-transparent rounded-2xl text-sm font-bold text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="absolute left-4 text-zinc-400 group-focus-within:text-blue-600 transition-colors">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
      </div>
    </form>
  );
}
