"use client";

import React from "react";
import AdminUsersSection from "./AdminUsersSection";
import AdminEventsSection from "./AdminEventsSection";

type AdminData = {
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  totalBookings: number;
};

interface AdminDashboardProps {
  adminData: AdminData;
}

export default function AdminDashboard({ adminData }: AdminDashboardProps) {
  const { totalUsers, totalEvents, totalRevenue, totalBookings } = adminData;

  return (
    <div className="space-y-6">
      {/* Platform Stats Overview */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Total Users</p>
              <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
            </div>
            <div className="rounded-full bg-white/20 p-3">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-purple-200">Registered users</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalEvents}
              </p>
            </div>
            <div className="rounded-full bg-indigo-50 p-3">
              <svg
                className="h-6 w-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Events on platform</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Platform Revenue
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Total paid bookings</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Bookings
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalBookings}
              </p>
            </div>
            <div className="rounded-full bg-yellow-50 p-3">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Paid tickets</p>
        </div>
      </section>

      {/* User Management */}
      <AdminUsersSection />

      {/* Event Management */}
      <AdminEventsSection />
    </div>
  );
}
