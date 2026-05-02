"use client";

import { useEffect, useState } from "react";
import MaterialCard from "@/components/ui/MaterialCard";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Stats aur Users fetch karne ka function
  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (result.success) setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Admin Actions handle karne ka function (Delete/Role Change)
  const handleAction = async (
    action: string,
    targetId: string,
    newRole?: string,
  ) => {
    if (!confirm("Are you sure you want to perform this action?")) return;

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

      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Action successful");
        fetchStats(); // Data refresh karein taake changes nazar aayein
      } else {
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
      <div className="p-10 text-center font-bold animate-pulse text-primary">
        Loading Admin Stats...
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">
        Admin Control Center
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MaterialCard elevation={1}>
          <p className="text-secondary text-sm font-bold uppercase tracking-wider">
            Total Users
          </p>
          <h2 className="text-5xl font-black text-primary">
            {data?.stats.totalUsers}
          </h2>
        </MaterialCard>
        <MaterialCard elevation={1}>
          <p className="text-secondary text-sm font-bold uppercase tracking-wider">
            Total Posts
          </p>
          <h2 className="text-5xl font-black text-primary">
            {data?.stats.totalPosts}
          </h2>
        </MaterialCard>
      </div>

      {/* User Management Table */}
      <MaterialCard elevation={2}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">User Directory</h3>
          {actionLoading && (
            <span className="text-xs text-primary font-bold animate-bounce">
              Processing...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-surface-variant">
                <th className="p-4 text-secondary font-bold">Name</th>
                <th className="p-4 text-secondary font-bold">Email</th>
                <th className="p-4 text-secondary font-bold">Role</th>
                <th className="p-4 text-secondary font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user: any) => (
                <tr
                  key={user._id}
                  className="border-b border-surface-variant hover:bg-surface/50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
                  <td className="p-4 text-secondary italic">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : user.role === "author"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {user.role !== "admin" && (
                        <>
                          <button
                            disabled={actionLoading}
                            onClick={() =>
                              handleAction(
                                "CHANGE_ROLE",
                                user._id,
                                user.role === "reader" ? "author" : "reader",
                              )
                            }
                            className="text-[11px] font-bold bg-surface border border-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all"
                          >
                            Set {user.role === "reader" ? "Author" : "Reader"}
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() =>
                              handleAction("DELETE_USER", user._id)
                            }
                            className="text-[11px] font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MaterialCard>
    </div>
  );
}
