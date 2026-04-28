"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MaterialCard from "@/components/ui/MaterialCard";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        // SUCCESS: Store the token for the browser to use
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data));

        // Redirect to dashboard or home
        router.push("/dashboard/create");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Is the server running?");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <MaterialCard elevation={2}>
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Welcome Back
          </h1>

          {error && (
            <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-3 rounded-xl bg-surface border border-surface-variant focus:ring-2 focus:ring-primary outline-none"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 rounded-xl bg-surface border border-surface-variant focus:ring-2 focus:ring-primary outline-none"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-full font-bold shadow-m3-1 hover:shadow-m3-2 transition-all mt-4"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-secondary">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-bold">
              Create one
            </Link>
          </p>
        </MaterialCard>
      </div>
    </div>
  );
}
