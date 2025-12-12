"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  };
};

export default function UserTicketsSection() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          My tickets
        </h2>
        <p className="text-sm text-gray-600">Loading your tickets...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
        My tickets
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        All bookings you&apos;ve made for events.
      </p>

      {tickets.length === 0 ? (
        <p className="text-sm text-gray-600">
          You don&apos;t have any tickets yet. Browse events and book to see them
          here.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Event
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Seats
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Total
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.map((ticket) => {
                const createdAt = new Date(ticket.createdAt);
                return (
                  <tr key={ticket._id}>
                    <td className="px-3 py-2 text-gray-800 font-medium">
                      {ticket.eventId?.title || "Event"}
                    </td>
                    <td className="px-3 py-2 text-gray-800">
                      {ticket.seats}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          ticket.status === "PAID"
                            ? "bg-emerald-50 text-emerald-700"
                            : ticket.status === "PENDING"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900">
                      ${ticket.totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600 text-xs">
                      {createdAt.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
