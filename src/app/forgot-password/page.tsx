"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSent(true);
        setMessage("Reset link has been dispatched to your inbox.");
      } else {
        setMessage(data.error || "Failed to process request.");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight italic">
            Lumina<span className="text-blue-600">.</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
            Access Recovery System
          </p>
        </div>

        {/* Card Section */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_4px_30px_-15px_rgba(0,0,0,0.08)]">
          {!isSent ? (
            <>
              <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-800">
                  Forgot Password?
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter your email to receive a recovery link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/10 transition-all outline-none"
                  />
                </div>

                {message && (
                  <p className="text-xs font-bold text-rose-500 text-center">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Check your inbox
              </h2>
              <p className="text-sm text-slate-500 mt-2 mb-8">
                We've sent password reset instructions to <br />
                <span className="font-bold text-slate-800">{email}</span>
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline"
              >
                Try another email
              </button>
            </div>
          )}
        </div>

        {/* Back to Login */}
        <div className="text-center mt-8">
          <Link
            href="/login"
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
