"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardActions from "@/components/DashboardActions";
import UserDashboard from "@/components/UserDashboard";
import OrganizerDashboard from "@/components/OrganizerDashboard";
import AdminDashboard from "@/components/AdminDashboard";

type EventSpending = {
  title: string;
  totalSpent: number;
};

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

type UserData = {
  totalSpent: number;
  totalBookings: number;
  eventsBooked: EventSpending[];
};

type OrganizerData = {
  totalRevenue: number;
  totalEvents: number;
  totalBookingsReceived: number;
  events: OrganizerEvent[];
};

type AdminData = {
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  totalBookings: number;
};

type DashboardUser = {
  _id: string;
  avatar: string | null;
  userName: string;
  email: string;
  role: "admin" | "user" | "organizer";
  isBlocked?: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userData?: UserData;
  organizerData?: OrganizerData;
  adminData?: AdminData;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For organizers: toggle between user view and organizer view
  const [activeView, setActiveView] = useState<"user" | "organizer">("organizer");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard", {
          credentials: "include",
        });
        const payload = await res.json();

        if (!res.ok || !payload.success) {
          setError(payload.message || "Failed to load dashboard");
          return;
        }

        setUser(payload.data as DashboardUser);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="rounded-full bg-red-100 p-3 w-12 h-12 mx-auto flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Unable to load dashboard
          </h1>
          <p className="mt-2 text-gray-600 text-sm">{error || "Please try again."}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const joinedAt = new Date(user.createdAt);
  const isAdmin = user.role === "admin";
  const isOrganizer = user.role === "organizer";

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

        {/* Organizer View Toggle */}
        {isOrganizer && (
          <div className="flex items-center justify-center">
            <div className="inline-flex rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setActiveView("organizer")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === "organizer"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-2">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Organizer Dashboard
                </span>
              </button>
              <button
                onClick={() => setActiveView("user")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === "user"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-2">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  My Tickets
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {isAdmin && user.adminData && (
          <AdminDashboard adminData={user.adminData} />
        )}

        {isOrganizer && activeView === "organizer" && user.organizerData && (
          <OrganizerDashboard organizerData={user.organizerData} />
        )}

        {isOrganizer && activeView === "user" && user.userData && (
          <UserDashboard userData={user.userData} />
        )}

        {!isAdmin && !isOrganizer && user.userData && (
          <UserDashboard userData={user.userData} />
        )}
      </div>
    </main>
  );
}
