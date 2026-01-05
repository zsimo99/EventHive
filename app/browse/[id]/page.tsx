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
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Event not found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the event you&apos;re looking for. It may
            have been removed or the link is incorrect.
          </p>
          <Link href="/browse" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Browse Events
          </Link>
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

  const categoryColors = {
    concerts: { bg: "from-purple-600 to-pink-600", light: "bg-purple-100", text: "text-purple-800", badge: "bg-purple-50 text-purple-800" },
    workshops: { bg: "from-green-600 to-emerald-600", light: "bg-green-100", text: "text-green-800", badge: "bg-green-50 text-green-800" },
    conferences: { bg: "from-orange-600 to-red-600", light: "bg-orange-100", text: "text-orange-800", badge: "bg-orange-50 text-orange-800" }
  };

  const colors = categoryColors[event.category] || categoryColors.concerts;

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation Bar */}
        <div className="mb-8 flex items-center justify-between gap-3 animate-fade-in">
          <div className="text-sm text-gray-500">
            <span className={`${colors.text} font-bold`}>EventHive</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className={`capitalize font-semibold ${colors.text}`}>{event.category}</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-600 truncate inline-block max-w-xs align-bottom font-medium">
              {event.title}
            </span>
          </div>

          <Link
            href="/browse"
            className="text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 font-medium flex items-center gap-2 transition-all duration-300 text-gray-700"
          >
            <span>&larr;</span>
            <span>Back</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Image with Premium Border */}
          <div className="lg:col-span-1">
            {event.image ? (
              <div className={`relative w-full h-80 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br ${colors.bg} border-4 border-white`}>
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
            ) : (
              <div className={`w-full h-80 rounded-3xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white font-bold shadow-2xl border-4 border-white`}>
                <span className="text-center text-lg">🎉 {event.title}</span>
              </div>
            )}
          </div>

          {/* Premium Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
              
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <span className={`inline-flex items-center rounded-full ${colors.badge} px-4 py-2 text-xs font-bold capitalize mb-4 inline-block`}>
                      {event.category}
                    </span>
                    <h1 className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent mb-3 leading-tight`}>
                      {event.title}
                    </h1>
                  </div>
                  <div className="text-right space-y-2 flex-shrink-0">
                    <div className={`${colors.light} rounded-2xl px-6 py-4`}>
                      <p className={`text-sm font-semibold ${colors.text} uppercase tracking-wider mb-1`}>
                        Price
                      </p>
                      <p className={`text-3xl font-black ${colors.text}`}>
                        {event.price === 0
                          ? "Free"
                          : `$${event.price.toFixed(2)}`}
                      </p>
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-6 py-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Capacity
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{event.capacity}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  {event.description}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Date & Time */}
                <div className={`${colors.light} rounded-2xl p-6`}>
                  <div className={`w-12 h-12 rounded-full ${colors.light} flex items-center justify-center ${colors.text} text-xl mb-3 bg-white border-2`}>
                    <IoIosCalendar />
                  </div>
                  <h2 className={`text-xs font-bold ${colors.text} uppercase tracking-widest mb-2`}>
                    Date &amp; Time
                  </h2>
                  <p className="text-gray-900 font-bold text-lg">
                    {eventDate.toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className={`${colors.text} font-semibold text-sm mt-1`}>
                    {eventDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Location */}
                <div className={`${colors.light} rounded-2xl p-6`}>
                  <div className={`w-12 h-12 rounded-full ${colors.light} flex items-center justify-center ${colors.text} text-xl mb-3 bg-white border-2`}>
                    <FaLocationDot />
                  </div>
                  <h2 className={`text-xs font-bold ${colors.text} uppercase tracking-widest mb-2`}>
                    Location
                  </h2>
                  <p className="text-gray-900 font-bold text-lg line-clamp-2">{event.location}</p>
                </div>
              </div>

              {/* Tags Section */}
              {event.tags && event.tags.length > 0 && (
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h2 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4">
                    Topics
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {event.tags.map((tag) => (
                      <Link href={`/browse?search=${tag}`}
                        key={tag}
                        className={`px-4 py-2 text-sm font-semibold rounded-full ${colors.light} ${colors.text} hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-current`}
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer Section */}
              {event.organizer && (
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h2 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4">
                    Hosted by
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${colors.light} flex items-center justify-center ${colors.text} text-2xl font-bold`}>
                      {(event.organizer.userName || "E")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-lg">
                        {event.organizer.userName || "Event organizer"}
                      </p>
                      {event.organizer.email && (
                        <p className={`${colors.text} font-medium text-sm`}>
                          {event.organizer.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
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