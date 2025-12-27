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
  isBlocked?: boolean;
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

  const updateUser = async (
    id: string,
    updates: { role?: "admin" | "user" | "organizer"; isBlocked?: boolean }
  ) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to update user");
        return;
      }

      toast.success("User updated successfully");
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, role: data.data.role, isBlocked: data.data.isBlocked }
            : u
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          User Management
        </h2>
        <p className="text-sm text-gray-600">Loading users...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          User Management
        </h2>
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
        User Management
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Search users, change roles, and manage user access.
      </p>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              loadUsers(value);
            }}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 text-sm focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
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
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
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
                const isUpdating = updatingId === user._id;
                return (
                  <tr
                    key={user._id}
                    className={user.isBlocked ? "bg-red-50" : ""}
                  >
                    <td className="px-3 py-2 text-gray-800 font-medium">
                      <div className="flex items-center gap-2">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.userName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                            {user.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{user.userName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{user.email}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700"
                            : user.role === "organizer"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
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
                      {user.role !== "admin" && (
                        <div className="flex flex-wrap justify-end gap-2">
                          {/* Role change dropdown */}
                          <select
                            value={user.role}
                            onChange={(e) =>
                              updateUser(user._id, {
                                role: e.target.value as "user" | "organizer",
                              })
                            }
                            disabled={isUpdating}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-xs focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 disabled:opacity-60"
                          >
                            <option value="user">User</option>
                            <option value="organizer">Organizer</option>
                          </select>

                          {/* Block/Unblock button */}
                          <button
                            type="button"
                            onClick={() =>
                              updateUser(user._id, {
                                isBlocked: !user.isBlocked,
                              })
                            }
                            disabled={isUpdating}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold disabled:opacity-60 ${
                              user.isBlocked
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            {isUpdating
                              ? "..."
                              : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                          </button>
                        </div>
                      )}
                      {user.role === "admin" && (
                        <span className="text-xs text-gray-400">Admin</span>
                      )}
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
