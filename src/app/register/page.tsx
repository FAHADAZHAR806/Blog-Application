"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MaterialCard from "@/components/ui/MaterialCard";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "reader",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        router.push("/pages/login?message=Account created successfully");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[460px]">
        <MaterialCard
          elevation={0}
          className="border border-gray-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] rounded-[40px] p-10"
        >
          {/* Header - Wix Bold Style */}
          <div className="text-center mb-10">
            <h1 className="text-[42px] font-black text-gray-900 tracking-tighter leading-none">
              Join Us
            </h1>
            <p className="text-gray-400 font-bold text-[13px] mt-4 tracking-wide uppercase">
              Join the Lumina community
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-[12px] font-bold border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-black text-gray-900 uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-5 rounded-[20px] bg-gray-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-[15px]"
                placeholder="Enter Your Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-black text-gray-900 uppercase tracking-widest mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-5 rounded-[20px] bg-gray-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-[15px]"
                placeholder="Enter Your Email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password with View Toggle */}
            <div>
              <label className="block text-[11px] font-black text-gray-900 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-5 rounded-[20px] bg-gray-50 border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-[15px]"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Role Selection - Clean Wix Buttons */}
            <div>
              <label className="block text-[11px] font-black text-gray-900 uppercase tracking-widest mb-3 ml-1">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "reader" })}
                  className={`py-4 rounded-[20px] text-[13px] font-black transition-all border-2 ${
                    formData.role === "reader"
                      ? "bg-black text-white border-black"
                      : "bg-transparent border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  Read Blogs
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "author" })}
                  className={`py-4 rounded-[20px] text-[13px] font-black transition-all border-2 ${
                    formData.role === "author"
                      ? "bg-black text-white border-black"
                      : "bg-transparent border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  Write Blogs
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
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-[13px] font-bold text-gray-400">
              Already a member?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-black hover:underline ml-1"
              >
                Sign In
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
