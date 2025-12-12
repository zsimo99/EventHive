import Link from "next/link";
// import { useEffect } from "react";

export default function CancelPage() {
  // useEffect(()=>{

  // },[])
  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <span className="text-3xl">❌</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Payment cancelled
      </h1>
      <p className="text-gray-600 mb-6">
        Your payment was cancelled. No charges have been made. You can try again
        or choose a different event.
      </p>

      <div className="space-y-3">
        <Link
          href="/browse"
          className="block w-full rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 transition"
        >
          Back to events
        </Link>
        <Link
          href="/dashboard"
          className="block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
        >
          View my bookings
        </Link>
      </div>
    </div>
  );
}
