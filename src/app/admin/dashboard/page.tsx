"use client";

import { useEffect, useState } from "react";
import MaterialCard from "@/components/ui/MaterialCard";

export default function AdminDashboard() {
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
      console.error("Failed to fetch stats");
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
    if (!confirm("Are you sure you want to proceed?")) return;
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

      if (res.ok) {
        fetchStats();
      } else {
        const result = await res.json();
        alert(result.error || "Action failed");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 bg-[#F8F9FA] min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Console
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Lumina Platform Management
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Live Status
          </span>
        </div>
      </header>

      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Users",
            value: data?.stats.totalUsers,
            color: "text-gray-900",
          },
          {
            label: "Total Posts",
            value: data?.stats.totalPosts,
            color: "text-blue-600",
          },
          {
            label: "Authors",
            value: data?.stats.authorsCount,
            color: "text-purple-600",
          },
          {
            label: "Comments",
            value: data?.stats.totalComments,
            color: "text-emerald-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm"
          >
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <h2 className={`text-4xl font-black ${stat.color}`}>
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* 2. Author Performance Directory (Naya Table) */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Author Performance</h3>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                  Author
                </th>
                <th className="p-5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                  Articles
                </th>
                <th className="p-5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                  Total Likes
                </th>
                <th className="p-5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.authorDirectory?.map((author: any) => (
                <tr
                  key={author._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-none">
                          {author.name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {author.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 font-bold text-sm text-gray-700">
                    {author.postCount}
                  </td>
                  <td className="p-5">
                    <span className="text-sm font-bold text-emerald-600">
                      ❤️ {author.totalLikesReceived}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Global User Management */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-bold text-gray-900">User Directory</h3>
          {actionLoading && (
            <span className="text-blue-600 text-xs font-bold animate-pulse">
              Updating Database...
            </span>
          )}
        </div>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="p-5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="p-5 text-[12px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.users.map((user: any) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-5">
                      <p className="text-sm font-bold text-gray-900 leading-none">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {user.email}
                      </p>
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                          user.role === "admin"
                            ? "bg-red-50 text-red-600"
                            : user.role === "author"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-gray-50 text-gray-500"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      {user.role !== "admin" && (
                        <div className="flex gap-2 justify-end">
                          <button
                            disabled={actionLoading}
                            onClick={() =>
                              handleAction(
                                "CHANGE_ROLE",
                                user._id,
                                user.role === "reader" ? "author" : "reader",
                              )
                            }
                            className="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all"
                          >
                            Make {user.role === "reader" ? "Author" : "Reader"}
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() =>
                              handleAction("DELETE_USER", user._id)
                            }
                            className="text-[11px] font-bold text-red-500 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"
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
      </section>
    </div>
  );
}
