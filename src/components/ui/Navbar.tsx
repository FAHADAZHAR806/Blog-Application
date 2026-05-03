"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/logout");
  };

  return (
    <nav className="h-16 border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand Name */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          Lumina<span className="text-blue-600">.</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[14px] font-medium text-gray-600 hover:text-black"
          >
            Explore
          </Link>

          {user ? (
            <div className="flex items-center gap-5">
              {/* Conditional Write Button */}
              {(user.role === "author" || user.role === "admin") && (
                <Link
                  href="/dashboard/create"
                  className="text-[13px] font-semibold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
                >
                  Write
                </Link>
              )}

              {/* User Identity */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="hidden sm:block text-right">
                  <p className="text-[13px] font-semibold text-gray-900 leading-none">
                    {user.name}
                  </p>
                  {user.role === "admin" ? (
                    <Link
                      href="/admin/dashboard"
                      className="text-[10px] text-blue-600 font-bold hover:underline"
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                      {user.role}
                    </p>
                  )}
                </div>

                {/* Minimalist Profile Icon */}
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[12px] font-bold text-blue-600">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-[12px] font-medium text-gray-400 hover:text-red-500"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-[14px] font-medium text-gray-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-[14px] font-semibold bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
