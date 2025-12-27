"use client";

import React from "react";
import Link from "next/link";

type OrganizerEvent = {
  _id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  image?: string;
  category: string;
  eventTotalGain: number;
  totalBookings: number;
  totalSeatsBooked: number;
};

type OrganizerData = {
  totalRevenue: number;
  totalEvents: number;
  totalBookingsReceived: number;
  events: OrganizerEvent[];
};

interface OrganizerDashboardProps {
  organizerData: OrganizerData;
}

export default function OrganizerDashboard({
  organizerData,
}: OrganizerDashboardProps) {
  const { totalRevenue, totalEvents, totalBookingsReceived, events } =
    organizerData;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-100">
                Total Revenue
              </p>
              <p className="mt-2 text-3xl font-bold">
                ${totalRevenue.toLocaleString(undefined, {
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
            Earnings from all your events
          </p>
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
          <p className="mt-2 text-xs text-gray-500">Events you have created</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Bookings
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalBookingsReceived}
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
            Tickets sold across all events
          </p>
        </div>
      </section>

      {/* Events Performance */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Event Performance
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Detailed statistics for each of your events
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No events yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first event to start tracking performance.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < new Date();
              const occupancyRate =
                event.capacity > 0
                  ? (event.totalSeatsBooked / event.capacity) * 100
                  : 0;

              return (
                <div
                  key={event._id}
                  className={`border rounded-xl p-4 transition-colors ${
                    isPast
                      ? "border-gray-200 bg-gray-50"
                      : "border-indigo-100 hover:border-indigo-200"
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Event Image */}
                    {event.image && (
                      <div className="w-full md:w-24 h-20 flex-shrink-0">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {event.title}
                            </h3>
                            {isPast && (
                              <span className="inline-flex rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                                Past
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg
                                className="h-3.5 w-3.5"
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
                              {eventDate.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                              </svg>
                              {event.location}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                event.category === "concerts"
                                  ? "bg-pink-50 text-pink-700"
                                  : event.category === "workshops"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {event.category}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-green-600">
                            ${event.eventTotalGain.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">revenue</p>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Bookings</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {event.totalBookings}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Seats Sold</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {event.totalSeatsBooked} / {event.capacity}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ticket Price</p>
                          <p className="text-sm font-semibold text-gray-900">
                            ${event.price}
                          </p>
                        </div>
                      </div>

                      {/* Occupancy Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Occupancy</span>
                          <span className="font-medium text-gray-700">
                            {occupancyRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              occupancyRate >= 80
                                ? "bg-green-500"
                                : occupancyRate >= 50
                                ? "bg-yellow-500"
                                : "bg-indigo-500"
                            }`}
                            style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
