"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Updated logic to match your folder structure (/pages/login, /pages/register)
  const isAuthPage =
    pathname === "/pages/login" || pathname === "/pages/register";

  if (isAuthPage) {
    return (
      <div className="absolute top-8 left-8 z-50">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>
    );
  }

  return <Navbar />;
}
