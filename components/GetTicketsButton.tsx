"use client";

import React, { useState, FormEvent } from "react";
import { toast } from "react-toastify";

interface GetTicketsButtonProps {
  eventId: string;
}

export default function GetTicketsButton({ eventId }: GetTicketsButtonProps) {
  const [open, setOpen] = useState(false);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleCreateBooking = async (e: FormEvent) => {
    e.preventDefault();
    if (seats < 1 || seats > 10) {
      toast.error("Seats must be between 1 and 10");
      return;
    }

    try {
      setLoading(true);

      // 1) Create booking
      const bookingRes = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventId, seats }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok || !bookingData.success) {
        toast.error(bookingData.message || "Failed to create booking");
        return;
      }

      const bookingId = bookingData.data?._id;
      if (!bookingId) {
        toast.error("Booking ID missing in response");
        return;
      }

      // 2) Start checkout
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok || !checkoutData.url) {
        toast.error("Failed to start checkout");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = await checkoutData.url as string;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while starting checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer px-6 py-2.5 rounded-xl bg-indigo-700 text-white font-semibold text-sm hover:bg-indigo-800 transition shadow-sm disabled:opacity-70"
        disabled={loading}
      >
        {loading ? "Processing..." : "Get tickets"}
      </button>

      {open && !loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Select seats
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose how many seats you want to book for this event.
            </p>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seats
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={seats}
                  onChange={(e) => setSeats(parseInt(e.target.value || "1", 10))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
                <p className="mt-1 text-xs text-gray-500">
                  You can book between 1 and 10 seats.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-700 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
                >
                  Continue to payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
