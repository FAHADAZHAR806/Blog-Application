"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MaterialCard from "@/components/ui/MaterialCard";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "reader", // Default role
  });
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
        // After registering, send them to login
        router.push("/login?message=Account created successfully");
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
    <div className="min-h-[calc(100-64px)] bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <MaterialCard elevation={2}>
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
            Create Account
          </h1>
          <p className="text-center text-secondary text-sm mb-6">
            Join the TactileBlog community
          </p>

          {error && (
            <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-xl bg-surface border border-surface-variant focus:ring-2 focus:ring-primary outline-none transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-3 rounded-xl bg-surface border border-surface-variant focus:ring-2 focus:ring-primary outline-none transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 rounded-xl bg-surface border border-surface-variant focus:ring-2 focus:ring-primary outline-none transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            {/* Role Selection - Material Style Radio Group */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "reader" })}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.role === "reader" ? "bg-primary text-white border-primary shadow-m3-1" : "bg-transparent border-surface-variant text-secondary"}`}
                >
                  Read & Comment
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "author" })}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.role === "author" ? "bg-primary text-white border-primary shadow-m3-1" : "bg-transparent border-surface-variant text-secondary"}`}
                >
                  Write Blogs
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-full font-bold shadow-m3-1 hover:shadow-m3-2 transition-all mt-4 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold">
              Sign In
            </Link>
          </p>
        </MaterialCard>
      </div>
    </div>
  );
}
