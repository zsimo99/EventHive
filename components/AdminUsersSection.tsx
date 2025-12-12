"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type AdminUser = {
  _id: string;
  userName: string;
  email: string;
  role: "admin" | "user" | "organizer";
  avatar?: string | null;
  emailVerified: boolean;
  createdAt: string;
};

export default function AdminUsersSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const loadUsers = async (query: string = "") => {
    try {
      if (!users.length) {
        setLoading(true);
      } else {
        setSearching(true);
      }

      const params = query ? `?search=${encodeURIComponent(query)}` : "";
      const res = await fetch(`/api/admin/users${params}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load users");
        return;
      }

      setUsers(data.data as AdminUser[]);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const updateRole = async (id: string, role: "admin" | "user" | "organizer") => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to update role");
        return;
      }

      toast.success("User role updated");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: data.data.role } : u))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          User management
        </h2>
        <p className="text-sm text-gray-600">Loading users...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          User management
        </h2>
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
        User management
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        View all users and promote regular users to organizers.
      </p>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            loadUsers(value);
          }}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
        />
        {searching && (
          <span className="text-xs text-gray-500 whitespace-nowrap">
            Searching...
          </span>
        )}
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  User
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Joined
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const createdAt = new Date(user.createdAt);
                return (
                  <tr key={user._id}>
                    <td className="px-3 py-2 text-gray-800 font-medium">
                      {user.userName}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{user.email}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          user.role === "admin"
                            ? "bg-red-50 text-red-700"
                            : user.role === "organizer"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600 text-xs">
                      {createdAt.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex gap-2">
                        {user.role === "user" && (
                          <button
                            type="button"
                            onClick={() => updateRole(user._id, "organizer")}
                            disabled={updatingId === user._id}
                            className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                          >
                            {updatingId === user._id
                              ? "Updating..."
                              : "Make organizer"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
