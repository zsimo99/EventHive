import { cookies } from "next/headers";
import DashboardActions from "@/components/DashboardActions";
import UserTicketsSection from "@/components/UserTicketsSection";
import AdminUsersSection from "@/components/AdminUsersSection";

type DashboardEvent = {
  title: string;
  totalGain: number;
};

type DashboardData = {
  _id: string | null;
  totalGain: number;
  events: DashboardEvent[];
};

type DashboardUser = {
  _id: string;
  avatar: string | null;
  userName: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  data: DashboardData;
};

async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`,
    {
      headers: {
        Cookie: token ? `accessToken=${token}` : "",
      },
      cache: "no-store",
    }
  );

  const payload = await res.json();

  if (!payload.success) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to load dashboard
          </h1>
          <p className="text-gray-600 text-sm mb-1">
            {(payload as { message?: string }).message ||
              "Please try again in a moment."}
          </p>
        </div>
      </div>
    );
  }

  const user = payload.data as DashboardUser;
  const stats = user.data;

  const joinedAt = new Date(user.createdAt);

  const isAdmin = user.role === "admin";
  const isOrganizer = user.role === "organizer";
  const isOrganizerOrAdmin = isAdmin || isOrganizer;

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Welcome back,</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {user.userName}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700 capitalize">
                {user.role}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${
                  user.emailVerified
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {user.emailVerified ? "Email verified" : "Email not verified"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right text-xs text-gray-500">
              <p>Member since</p>
              <p className="font-medium text-gray-800">
                {joinedAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold shadow-md">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span>{user.userName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <DashboardActions />
          </div>
        </header>

        {/* Overview cards (not for admin) */}
        {!isAdmin && (
          <section className="grid gap-4 md:grid-cols-3">
            <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {isOrganizer ? "Total earnings" : "Total spent"}
              </h2>
              <p className="text-3xl font-bold text-gray-900">
                ${stats.totalGain.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {isOrganizer
                  ? "Revenue generated across all your events."
                  : "Money spent on your bookings."}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-center">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {isOrganizer ? "Active events" : "Events booked"}
              </h2>
              <p className="text-3xl font-bold text-gray-900">
                {stats.events.length}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {isOrganizer
                  ? "Events contributing to your current earnings."
                  : "Events you have booked so far."}
              </p>
            </div>
          </section>
        )}

        {/* Events / bookings breakdown (not for admin) */}
        {!isAdmin && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {isOrganizer ? "Earnings by event" : "Spending by event"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {isOrganizer
                    ? "Overview of how much each event has generated."
                    : "Overview of how much you have spent per event."}
                </p>
              </div>
            </div>

            {stats.events.length === 0 ? (
              <p className="text-sm text-gray-600">
                {isOrganizer
                  ? "You don&apos;t have any events with earnings yet. Create an event to see your revenue here."
                  : "You don&apos;t have any bookings yet. Browse events and book tickets to see your activity here."}
              </p>
            ) : (
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        Event
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        Total gain
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.events.map((event) => (
                      <tr key={event.title}>
                        <td className="px-3 py-2 text-gray-800 font-medium">
                          {event.title}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-900">
                          ${event.totalGain.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Role-specific extra sections */}
        {!isOrganizerOrAdmin && <UserTicketsSection />}
        {isAdmin && <AdminUsersSection />}
      </div>
    </main>
  );
}

export default DashboardPage;
