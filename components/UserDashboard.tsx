"use client";

import React from "react";
import UserTicketsSection from "./UserTicketsSection";

type EventSpending = {
  title: string;
  totalSpent: number;
};

type UserData = {
  totalSpent: number;
  totalBookings: number;
  eventsBooked: EventSpending[];
};

interface UserDashboardProps {
  userData: UserData;
}

export default function UserDashboard({ userData }: UserDashboardProps) {
  const { totalSpent, totalBookings, eventsBooked } = userData;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-100">Total Spent</p>
              <p className="mt-2 text-3xl font-bold">
                ${totalSpent.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-indigo-200">
            Total money spent on event tickets
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Events Booked</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalBookings}
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
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Number of events you&apos;ve booked
          </p>
        </div>
      </section>

      {/* Spending by Event */}
      {eventsBooked.length > 0 && (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Spending by Event
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Breakdown of your spending per event
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Event
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount Spent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eventsBooked.map((event, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-gray-800 font-medium">
                      {event.title}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900">
                      ${event.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* My Tickets */}
      <UserTicketsSection />
    </div>
  );
}
