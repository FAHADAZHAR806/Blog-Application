"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="bg-surface-container border-b border-surface-variant px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold text-primary">
        TactileBlog
      </Link>

      <div className="flex gap-4 items-center">
        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard/create"
              className="text-sm font-medium px-4 py-2 hover:bg-surface-variant rounded-full"
            >
              Write
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 px-4 py-2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
