"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Link from "next/link";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return (
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="text-sm font-bold flex items-center gap-2 text-slate-600 hover:text-primary transition-all"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return <Navbar />;
}
