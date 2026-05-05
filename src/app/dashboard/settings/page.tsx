"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Bell,
  Camera,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // States for user data
  const [name, setName] = useState("Professional Engineer");
  const [bio, setBio] = useState(
    "Full-stack developer focused on MERN stack and clean UI/UX.",
  );

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulating API Call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white text-black selection:bg-zinc-100">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-zinc-50 px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard/my-posts"
            className="group flex items-center gap-3 text-zinc-400 hover:text-black transition-all"
          >
            <div className="p-2 rounded-full border border-transparent group-hover:border-zinc-100 group-hover:bg-zinc-50">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">
              Back to Dashboard
            </span>
          </Link>

          {success && (
            <div className="flex items-center gap-2 text-green-600 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Changes Saved
              </span>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-20">
        <header className="mb-16">
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            Settings
          </h1>
          <p className="text-zinc-400 text-xs font-black uppercase tracking-[0.3em]">
            Configure your digital identity.
          </p>
        </header>

        <form onSubmit={handleUpdate} className="space-y-16">
          {/* Profile Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 text-zinc-300">
              <User size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Public Profile
              </span>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[2rem] bg-zinc-100 overflow-hidden border border-zinc-100 transition-transform group-hover:scale-105">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-black text-white rounded-xl cursor-pointer hover:bg-zinc-800 transition-all shadow-xl">
                  <Camera size={14} />
                  <input type="file" className="hidden" />
                </label>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-tight">
                  Display Portrait
                </h3>
                <p className="text-[10px] text-zinc-400 font-bold leading-relaxed">
                  Recommended: Cinematic editorial style portraits for recruiter
                  visibility.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 pt-4">
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-black transition-colors mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-100 py-3 text-lg font-black outline-none focus:border-black transition-all"
                />
              </div>

              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-black transition-colors mb-2 block">
                  Professional Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-100 py-3 text-sm font-bold outline-none focus:border-black transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Account Security Section */}
          <section className="space-y-8 pt-8 border-t border-zinc-50">
            <div className="flex items-center gap-4 text-zinc-300">
              <Shield size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Security
              </span>
            </div>

            <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-[2rem]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">
                  Two-Factor Authentication
                </p>
                <p className="text-[10px] text-zinc-400 font-bold">
                  Enhance your architectural security.
                </p>
              </div>
              <div className="w-12 h-6 bg-zinc-200 rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-zinc-200"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Confirm All Revisions"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
