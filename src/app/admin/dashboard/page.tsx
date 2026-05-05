"use client";

import { useEffect, useState } from "react";
// Wix vibe ke liye hum icons ko minimal rakhenge aur color palette vibrant use karenge

export default function LuminaWixConsole() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setData(result);
    } catch (err) {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAction = async (
    action: string,
    targetId: string,
    newRole?: string,
  ) => {
    if (!confirm("Are you sure you want to update this user?")) return;
    setActionLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, targetId, newRole }),
      });

      if (res.ok) fetchStats();
      else alert("Update failed");
    } catch (err) {
      alert("Connection error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 font-bold tracking-widest text-xs uppercase">
            Lumina System Loading
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Wix-Inspired Premium Header */}
        <header className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-800">
              Lumina<span className="text-blue-600">Feed</span> Admin
            </h1>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">
              Platform Control Center
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-zinc-800">
                System Integrity
              </p>
              <p className="text-[10px] text-emerald-500 font-black uppercase">
                Live & Secure
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:shadow-xl hover:shadow-blue-200 active:scale-95">
              System Settings
            </button>
          </div>
        </header>

        {/* Dynamic Stats - Wix Style Gradients */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Total Users",
              value: data?.stats.totalUsers,
              color: "from-blue-600 to-indigo-500",
            },
            {
              label: "Community Posts",
              value: data?.stats.totalPosts,
              color: "from-purple-600 to-fuchsia-500",
            },
            {
              label: "Verified Authors",
              value: data?.stats.authorsCount,
              color: "from-orange-500 to-amber-400",
            },
            {
              label: "Engagement",
              value: data?.stats.totalComments,
              color: "from-emerald-500 to-teal-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white relative overflow-hidden group hover:shadow-md transition-all"
            >
              <div
                className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${stat.color}`}
              ></div>
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2">
                {stat.label}
              </p>
              <h2 className="text-4xl font-black text-zinc-800 tracking-tighter">
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        {/* User Management - Spacious Wix Table */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-white overflow-hidden">
          <div className="p-10 border-b border-zinc-50 flex justify-between items-center bg-gradient-to-r from-white to-zinc-50/50">
            <div>
              <h2 className="text-xl font-black text-zinc-800">
                User Permissions
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                Manage roles and account status
              </p>
            </div>
            {actionLoading && (
              <div className="text-[10px] font-black text-blue-600 animate-pulse uppercase tracking-widest">
                Processing Data...
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">User Identity</th>
                  <th className="px-10 py-6">Access Level</th>
                  <th className="px-10 py-6 text-right">
                    Administrative Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {data?.users.map((user: any) => (
                  <tr
                    key={user._id}
                    className="group hover:bg-blue-50/20 transition-all"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-50 flex items-center justify-center font-black text-zinc-400 text-lg border border-zinc-100 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent transition-all">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-zinc-400 font-medium">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                          user.role === "admin"
                            ? "bg-zinc-800 text-white border-zinc-800"
                            : "bg-white text-blue-600 border-blue-50"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      {user.role !== "admin" && (
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() =>
                              handleAction(
                                "CHANGE_ROLE",
                                user._id,
                                user.role === "reader" ? "author" : "reader",
                              )
                            }
                            className="bg-white hover:bg-zinc-800 hover:text-white border border-zinc-100 text-zinc-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                          >
                            Update to{" "}
                            {user.role === "reader" ? "Author" : "Reader"}
                          </button>
                          <button
                            onClick={() =>
                              handleAction("DELETE_USER", user._id)
                            }
                            className="text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
