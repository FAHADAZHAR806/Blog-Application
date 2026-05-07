"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fileToBase64 } from "@/lib/file-to-base64";
import {
  User,
  Shield,
  Camera,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [twoFA, setTwoFA] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string>(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  );

  // ✅ localStorage se user data load karo
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return router.push("/pages/login");
    const user = JSON.parse(userData);
    setName(user.name || "");
    setBio(user.bio || "");
    if (user.profileImage) setAvatar(user.profileImage);
  }, [router]);

  // ✅ Image Cloudinary pe upload karo
  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5MB.");
        return;
      }

      setAvatarUploading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const base64 = await fileToBase64(file);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image: base64,
            folder: "profiles",
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        // ✅ Permanent Cloudinary URL set karo
        setAvatar(data.data.url);
      } catch (err: any) {
        setError(err.message || "Image upload failed. Please try again.");
      } finally {
        setAvatarUploading(false);
      }
    },
    [],
  );

  // ✅ /api/user/update route use ho raha hai — sahi URL aur body
  const handleUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        if (!user) return router.push("/pages/login");

        const res = await fetch("/api/user/update", {
          // ✅ sahi route
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: user._id || user.id, // ✅ id body mein
            name: name.trim(),
            bio: bio.trim(),
            profileImage: avatar, // ✅ Cloudinary URL
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          // ✅ localStorage sync taake poori app mein update dikhe
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, ...updated.data }),
          );
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          const result = await res.json();
          setError(result.message || "Failed to save changes.");
        }
      } catch {
        setError("Couldn't reach the server. Check your connection.");
      } finally {
        setLoading(false);
      }
    },
    [name, bio, avatar, router],
  );

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

        {error && (
          <div className="mb-10 flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-16">
          {/* Profile Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 text-zinc-300">
              <User size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Public Profile
              </span>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-8">
              <div className="relative group">
                <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden border border-zinc-100 transition-transform group-hover:scale-105">
                  <Image
                    src={avatar}
                    alt="Avatar"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  {avatarUploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <Loader2 size={20} className="animate-spin text-black" />
                    </div>
                  )}
                </div>
                <label
                  className={`absolute -bottom-2 -right-2 p-2 bg-black text-white rounded-xl shadow-xl transition-all ${
                    avatarUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-zinc-800"
                  }`}
                >
                  <Camera size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={avatarUploading}
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-tight">
                  Display Portrait
                </h3>
                <p className="text-[10px] text-zinc-400 font-bold leading-relaxed">
                  Max 5MB. Uploads to cloud — persists across all sessions.
                </p>
                {avatarUploading && (
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest animate-pulse">
                    Uploading to cloud...
                  </p>
                )}
              </div>
            </div>

            {/* Fields */}
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

          {/* Security */}
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
              <button
                type="button"
                onClick={() => setTwoFA((v) => !v)}
                className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors duration-300 ${
                  twoFA ? "bg-black" : "bg-zinc-200"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                    twoFA ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || avatarUploading || !name.trim()}
            className="w-full bg-black text-white py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-zinc-200 disabled:opacity-20"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : avatarUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Waiting for image...
              </>
            ) : (
              "Confirm All Revisions"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
