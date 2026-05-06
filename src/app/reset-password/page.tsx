"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      alert("Password updated successfully!");
      router.push("/login");
    } else {
      alert("Link expired or invalid.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-sm">
        <h2 className="text-xl font-black mb-6 italic">Set New Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
