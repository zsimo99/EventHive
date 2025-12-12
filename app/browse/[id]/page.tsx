import Image from "next/image";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosCalendar } from "react-icons/io";
import GetTicketsButton from "@/components/GetTicketsButton";
import ShareEventButton from "@/components/ShareEventButton";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/event/${id}`,
    { cache: "no-store" }
  );
  const data = await res.json();

  if (!data.success) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h1>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find the event you&apos;re looking for. It may
            have been removed or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  const event = data.data as {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: "concerts" | "workshops" | "conferences";
    tags: string[];
    price: number;
    image: string;
    capacity: number;
    organizer?: { userName?: string; email?: string };
  };

  const eventDate = new Date(event.date);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="text-sm text-gray-500">
            <span className="text-indigo-700 font-semibold">EventHive</span>
            <span className="mx-2">/</span>
            <span className="capitalize">{event.category}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-700 truncate inline-block max-w-xs align-bottom">
              {event.title}
            </span>
          </div>

          <Link
            href="/browse"
            className="text-sm text-indigo-700 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            <span>&larr;</span>
            <span>Back to events</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Image / Media */}
          <div className="lg:col-span-1">
            {event.image ? (
              <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-white">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
            ) : (
              <div className="w-full h-64 md:h-80 rounded-2xl bg-linear-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-semibold shadow-inner">
                Image coming soon
              </div>
            )}
          </div>

          {/* Details card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 capitalize">
                    {event.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {event.title}
                  </h1>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {event.price === 0
                      ? "Free event"
                      : `From $${event.price.toFixed(2)}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Capacity: <span className="font-medium">{event.capacity}</span>{" "}
                    guests
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {event.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 text-lg">
                    <IoIosCalendar />

                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Date &amp; Time
                    </h2>
                    <p className="text-gray-900 font-medium">
                      {eventDate.toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {eventDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 text-lg">
                    <FaLocationDot />

                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Location
                    </h2>
                    <p className="text-gray-900 font-medium">{event.location}</p>
                  </div>
                </div>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Link href={`/browse?search=${tag}`}
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {event.organizer && (
                <div className="border-t pt-4 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Hosted by
                    </h2>
                    <p className="text-gray-900 font-medium">
                      {event.organizer.userName || "Event organizer"}
                    </p>
                    {event.organizer.email && (
                      <p className="text-sm text-gray-600">
                        Contact: {event.organizer.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <GetTicketsButton eventId={event._id} />
                <ShareEventButton title={event.title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}