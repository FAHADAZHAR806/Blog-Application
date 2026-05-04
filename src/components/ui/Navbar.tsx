"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PenSquare,
  LayoutDashboard,
  LogOut,
  Compass,
  Menu,
  X,
  ChevronRight,
  User,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/pages/logout");
    setIsOpen(false);
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

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-[14px] font-medium text-gray-600 hover:text-black"
          >
            Explore
          </Link>

          {user ? (
            <div className="flex items-center gap-5">
              {(user.role === "author" || user.role === "admin") && (
                <>
                  <Link
                    href="/dashboard/create"
                    className="text-[13px] font-semibold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
                  >
                    Write
                  </Link>
                  <Link
                    href="/dashboard/my-posts"
                    className="text-[13px] font-semibold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
                  >
                    My Blogs
                  </Link>
                </>
              )}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-gray-900 leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                    {user.role}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[12px] font-bold text-blue-600">
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
                href="/pages/login"
                className="text-[14px] font-medium text-gray-600"
              >
                Login
              </Link>
              <Link
                href="/pages/register"
                className="text-[14px] font-semibold bg-blue-600 text-white px-5 py-2 rounded-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button (Visible only on Mobile) */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* --- MOBILE OVERLAY & SIDEBAR --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          <button
            onClick={() => setIsOpen(false)}
            className="self-end p-2 mb-4 text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>

          {/* User Profile Info (Top of Menu) */}
          {user ? (
            <div className="mb-8 p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold leading-tight">{user.name}</p>
                  <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-500">
                Welcome to Lumina
              </p>
            </div>
          )}

          {/* Navigation Links Grouped */}
          <div className="space-y-2 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2 mb-4">
              Main Menu
            </p>

            <MobileLink
              href="/"
              icon={<Compass className="w-5 h-5 text-blue-500" />}
              label="Explore"
              onClick={() => setIsOpen(false)}
            />

            {user && (user.role === "author" || user.role === "admin") && (
              <>
                <MobileLink
                  href="/dashboard/create"
                  icon={<PenSquare className="w-5 h-5 text-emerald-500" />}
                  label="Write Post"
                  onClick={() => setIsOpen(false)}
                />
                <MobileLink
                  href="/dashboard/my-posts"
                  icon={<LayoutDashboard className="w-5 h-5 text-purple-500" />}
                  label="My Blogs"
                  onClick={() => setIsOpen(false)}
                />
              </>
            )}

            {!user && (
              <div className="pt-4 space-y-3">
                <Link
                  href="/pages/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 text-center font-bold text-gray-600 bg-gray-50 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  href="/pages/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 text-center font-bold bg-blue-600 text-white rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Logout at Bottom */}
          {user && (
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center justify-between p-4 bg-red-50 text-red-600 rounded-xl font-bold transition-colors active:bg-red-100"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

// Sub-component for Mobile Links
function MobileLink({ href, icon, label, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all group"
    >
      <div className="flex items-center gap-4">
        <span className="p-2 bg-white rounded-lg shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <span className="font-bold text-gray-700">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300" />
    </Link>
  );
}
