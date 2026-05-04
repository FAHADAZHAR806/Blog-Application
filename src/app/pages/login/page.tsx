"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MaterialCard from "@/components/ui/MaterialCard";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        // --- DATA SAFETY LOGIC ---
        // API response structure ke mutabiq data nikalna
        const token = result.token || (result.data && result.data.token);
        const userData = result.user || result.data;

        if (token) {
          // 1. Local Storage for UI state
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));

          // 2. Cookie for Middleware (Server-side safety)
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

          // 3. Auth Change Event (Navbar update ke liye)
          window.dispatchEvent(new Event("auth-change"));

          // --- 4. ROLE-BASED REDIRECTION LOGIC ---
          const userRole = userData.role;

          if (userRole === "admin") {
            window.location.href = "/admin/dashboard"; // Admin direct control center mein
          } else if (userRole === "author") {
            window.location.href = "/dashboard/my-posts"; // Author apne posts ki list mein
          } else {
            window.location.href = "/"; // Reader seedha home page par
          }
        } else {
          setError("Login successful, but no security token was received.");
        }
      } else {
        setError(
          result.error || "Invalid email or password. Please try again.",
        );
      }
    } catch (err) {
      setError("Server connection failed. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <MaterialCard elevation={2}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-secondary mt-2">
              Log in to your Tactile account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 text-sm flex items-start">
              <span className="flex-1">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full p-4 rounded-2xl bg-surface border border-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-4 rounded-2xl bg-surface border border-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white py-4 rounded-full font-bold shadow-m3-1 hover:shadow-m3-2 transform active:scale-[0.98] transition-all mt-4 ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-opacity-90"
              }`}
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-variant text-center">
            <p className="text-sm text-secondary">
              Don't have an account?{" "}
              <Link
                href="/pages/register"
                className="text-primary font-bold hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </MaterialCard>
      </div>
    </div>
  );
}
