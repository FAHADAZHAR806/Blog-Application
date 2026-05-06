"use client";

import { useEffect, useState } from "react";

export default function CleanAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const syncDashboard = async () => {
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const d = await res.json();
      if (d.success) setData(d);
    } catch (err) {
      console.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncDashboard();
  }, []);

  const handleAction = async (action: string, userId: string, extra = {}) => {
    if (!window.confirm("Confirm this action?")) return;
    setIsProcessing(true);
    try {
      await fetch("/api/admin/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ action, targetId: userId, ...extra }),
      });
      await syncDashboard();
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
        <div className="text-sm font-medium animate-pulse text-slate-400 uppercase tracking-widest">
          Initialising_System...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fbfbfb] p-6 md:p-12 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Simple Text Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight italic">
              Lumina<span className="text-blue-600">.</span>HQ
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Management Console
            </p>
          </div>
          {isProcessing && (
            <span className="text-[9px] font-black text-blue-600 animate-pulse uppercase">
              Updating_Core...
            </span>
          )}
        </div>

        {/* Floating Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              label: "Total Users",
              val: data.stats.totalUsers,
              color: "bg-white",
            },
            {
              label: "Global Posts",
              val: data.stats.totalPosts,
              color: "bg-white",
            },
            {
              label: "Total Reactions",
              val: data.stats.totalLikes,
              color: "bg-white",
            },
            {
              label: "Comments",
              val: data.stats.totalComments,
              color: "bg-white",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`${s.color} p-6 rounded-2xl shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.02]`}
            >
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {s.label}
              </p>
              <p className="text-3xl font-black">{s.val}</p>
            </div>
          ))}
        </div>

        {/* Reader & Creator Side-by-Side (Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Reader Activity Table */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)]">
            <h2 className="text-[11px] font-black uppercase text-emerald-600 mb-6 flex items-center gap-2 tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>{" "}
              Reader Activity
            </h2>
            <div className="space-y-4">
              {data.readerPerformance.map((u: any) => (
                <div
                  key={u._id}
                  className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <span className="text-sm font-bold text-slate-700">
                    {u.name}
                  </span>
                  <div className="flex gap-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      L: {u.likesGiven || 0}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      C: {u.commentsWritten || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creator Performance Table */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)]">
            <h2 className="text-[11px] font-black uppercase text-blue-600 mb-6 flex items-center gap-2 tracking-widest">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>{" "}
              Creator Insights
            </h2>
            <div className="space-y-4">
              {data.creatorPerformance.map((u: any) => (
                <div
                  key={u._id}
                  className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <span className="text-sm font-bold text-slate-700">
                    {u.name}
                  </span>
                  <div className="flex gap-4">
                    <span className="text-[11px] font-black text-blue-500">
                      {u.postCount} Posts
                    </span>
                    <span className="text-[11px] font-black text-rose-500">
                      {u.likesReceived} Impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Access Management Table (Modern Style) */}
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="px-8 py-6 bg-[#121212] flex justify-between items-center">
            <h2 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">
              System Registry
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {data.users.map((user: any) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <p className="font-bold text-sm">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium lowercase tracking-tight">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {user.role !== "admin" && (
                        <div className="flex justify-end gap-6">
                          <button
                            onClick={() =>
                              handleAction("CHANGE_ROLE", user._id, {
                                newRole:
                                  user.role === "reader" ? "author" : "reader",
                              })
                            }
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            UPGRADE
                          </button>
                          <button
                            onClick={() =>
                              handleAction("DELETE_USER", user._id)
                            }
                            className="text-[10px] font-bold text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            REMOVE
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
