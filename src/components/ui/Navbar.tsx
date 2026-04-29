"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  // Use null as initial state to prevent Next.js hydration flickering
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Function to check if the user is authenticated
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // 1. Check immediately when the component mounts
    checkAuth();

    // 2. Listen for 'storage' changes (works if login happens in another tab)
    window.addEventListener("storage", checkAuth);

    // 3. Listen for our custom 'auth-change' event (works for our Login page)
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);

    // Force a hard refresh to the home page to clear all states
    window.location.href = "/login";
  };

  // Don't render buttons until we know the auth status (prevents ghost buttons)
  if (isLoggedIn === null)
    return (
      <nav className="bg-surface-container border-b border-surface-variant px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold text-primary">
          TactileBlog
        </Link>
      </nav>
    );

  return (
    <nav className="bg-surface-container border-b border-surface-variant px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link
        href="/"
        className="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
      >
        TactileBlog
      </Link>

      <div className="flex gap-2 items-center">
        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard/create"
              className="text-sm font-bold text-primary px-5 py-2 hover:bg-primary/10 rounded-full transition-colors"
            >
              Write
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-bold text-red-600 px-5 py-2 hover:bg-red-50 rounded-full transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-primary text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-m3-1 hover:shadow-m3-2 active:scale-95 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
