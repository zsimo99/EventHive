"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type AdminEvent = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  category: string;
  image?: string;
  organizer: {
    _id: string;
    userName: string;
    email: string;
  };
  createdAt: string;
};

export default function AdminEventsSection() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadEvents = async (query: string = "") => {
    try {
      if (!events.length) {
        setLoading(true);
      } else {
        setSearching(true);
      }

      const params = query ? `?search=${encodeURIComponent(query)}` : "";
      const res = await fetch(`/api/admin/events${params}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load events");
        return;
      }

      setEvents(data.data as AdminEvent[]);
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const deleteEvent = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to delete event");
        return;
      }

      toast.success("Event deleted successfully");
      setEvents((prev) => prev.filter((e) => e._id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Event Management
        </h2>
        <p className="text-sm text-gray-600">Loading events...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Event Management
        </h2>
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
        Event Management
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Search and manage all events on the platform.
      </p>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              loadEvents(value);
            }}
            placeholder="Search by title, description, or location..."
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

      {events.length === 0 ? (
        <p className="text-sm text-gray-600">No events found.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const isDeleting = deletingId === event._id;
            const isConfirming = confirmDeleteId === event._id;

            return (
              <div
                key={event._id}
                className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Event Image */}
                  {event.image && (
                    <div className="w-full md:w-32 h-24 flex-shrink-0">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {event.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize flex-shrink-0 ${
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

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
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
                          year: "numeric",
                          month: "short",
                          day: "numeric",
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {event.location}
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        ${event.price}
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {event.capacity} seats
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Organizer:{" "}
                        <span className="font-medium text-gray-700">
                          {event.organizer?.userName || "Unknown"}
                        </span>{" "}
                        ({event.organizer?.email || "N/A"})
                      </p>

                      {/* Delete controls */}
                      <div className="flex items-center gap-2">
                        {isConfirming ? (
                          <>
                            <span className="text-xs text-red-600 mr-2">
                              Delete this event?
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteEvent(event._id)}
                              disabled={isDeleting}
                              className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                              {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              disabled={isDeleting}
                              className="rounded-lg bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-60"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(event._id)}
                            className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        )}
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
  );
}
