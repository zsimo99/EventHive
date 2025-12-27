"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

type TicketStatus = "PENDING" | "PAID" | "CANCELLED";

type Ticket = {
  _id: string;
  seats: number;
  status: TicketStatus;
  totalPrice: number;
  createdAt: string;
  eventId: {
    _id: string;
    title: string;
    date: string;
    location: string;
    image?: string;
    price: number;
  };
};

export default function UserTicketsSection() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/booking", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load tickets");
          return;
        }

        setTickets(data.data as Ticket[]);
      } catch (err) {
        console.error(err);
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const copyTicketId = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId);
    toast.success("Ticket ID copied to clipboard!");
  };

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          My Tickets
        </h2>
        <p className="text-sm text-gray-600">Loading your tickets...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
        My Tickets
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        All your event bookings with ticket details.
      </p>

      {tickets.length === 0 ? (
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
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No tickets yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Browse events and book tickets to see them here.
          </p>
          <div className="mt-4">
            <Link
              href="/browse"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Browse Events
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const createdAt = new Date(ticket.createdAt);
            const eventDate = ticket.eventId?.date
              ? new Date(ticket.eventId.date)
              : null;
            const isExpanded = expandedTicket === ticket._id;

            return (
              <div
                key={ticket._id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  ticket.status === "CANCELLED"
                    ? "border-red-200 bg-red-50"
                    : ticket.status === "PAID"
                    ? "border-green-200 bg-green-50"
                    : "border-yellow-200 bg-yellow-50"
                }`}
              >
                {/* Ticket Header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() =>
                    setExpandedTicket(isExpanded ? null : ticket._id)
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Event Image */}
                      {ticket.eventId?.image && (
                        <img
                          src={ticket.eventId.image}
                          alt={ticket.eventId?.title || "Event"}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {ticket.eventId?.title || "Event"}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {ticket.seats} seat{ticket.seats > 1 ? "s" : ""} •
                          Booked on{" "}
                          {createdAt.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          ticket.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : ticket.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${ticket.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="flex items-center justify-center mt-2">
                    <svg
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-white p-4 space-y-4">
                    {/* Ticket ID */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Ticket ID
                        </p>
                        <p className="text-sm font-mono font-semibold text-gray-900 mt-1">
                          {ticket._id}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyTicketId(ticket._id);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy
                      </button>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Event Date
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {eventDate
                            ? eventDate.toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </p>
                        {eventDate && (
                          <p className="text-xs text-gray-500">
                            {eventDate.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Location
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {ticket.eventId?.location || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Price per Seat
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          ${ticket.eventId?.price?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Total Seats
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {ticket.seats}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <Link
                        href={`/browse/${ticket.eventId?._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        View Event
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>

                      {ticket.status === "PAID" && eventDate && eventDate > new Date() && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Valid ticket
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
