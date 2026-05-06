"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MaterialCard from "@/components/ui/MaterialCard";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Password toggle state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        const token = result.token || (result.data && result.data.token);
        const userData = result.user || result.data;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
          window.dispatchEvent(new Event("auth-change"));

          const userRole = userData.role;
          if (userRole === "admin") {
            window.location.href = "/admin/dashboard";
          } else if (userRole === "author") {
            window.location.href = "/dashboard/my-posts";
          } else {
            window.location.href = "/";
          }
        }
      } else {
        setError(result.error || "Invalid credentials.");
      }
    } catch (err) {
      setError("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[420px]">
        <MaterialCard
          elevation={0}
          className="border border-gray-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] rounded-[40px] p-10"
        >
          <div className="text-center mb-10">
            <h1 className="text-[42px] font-black text-gray-900 tracking-tighter leading-none">
              Log In
            </h1>
            <p className="text-gray-400 font-bold text-[13px] mt-4 tracking-wide uppercase">
              Professional Access
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-[12px] font-bold border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-black text-gray-900 uppercase tracking-widest mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-5 rounded-[20px] bg-gray-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-[15px]"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field with View Toggle & Forgot Link */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[11px] font-black text-gray-900 uppercase tracking-widest">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline transition-all"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-5 rounded-[20px] bg-gray-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-[15px]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-full font-black text-[16px] tracking-tight transition-all active:scale-[0.97] mt-4 shadow-xl ${
                loading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-black shadow-blue-100"
              }`}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-[13px] font-bold text-gray-400">
              New here?{" "}
              <Link
                href="/register"
                className="text-blue-600 font-black hover:underline ml-1"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </MaterialCard>

        <p className="text-center mt-8 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
          LUMINA SECURE
        </p>
      </div>
    </div>
  );
}
