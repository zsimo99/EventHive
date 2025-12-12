import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <span className="text-3xl">✅</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Payment successful
      </h1>
      <p className="text-gray-600 mb-6">
        Your booking has been confirmed. A confirmation email with your event
        details has been sent to your inbox.
      </p>

      <div className="space-y-3">
        <Link
          href="/dashboard"
          className="block w-full rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 transition"
        >
          Go to my bookings
        </Link>
        <Link
          href="/browse"
          className="block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
        >
          Browse more events
        </Link>
      </div>
    </div>
  );
}
