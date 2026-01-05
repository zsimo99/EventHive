import Image from "next/image";
import Link from "next/link";
import { FiDollarSign } from "react-icons/fi";
import {
  IoCalendarClearOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";

function EventCard({ ...props }) {
  const formateDate = (date: Date) => {
    const formatted = date
      .toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "") // remove comma before year
      .replace(",", "") // remove comma before year
      .replace(",", " at");
    return formatted;
  };

  const bookingPercentage = ((props.bookedSeats * 100) / props.capacity).toFixed(0);
  const seatsAvailable = props.capacity - props.booked;
  const isSoldOut = seatsAvailable <= 0;

  const categoryColors = {
    concerts: { bg: "from-purple-600 to-pink-600", light: "bg-purple-100", text: "text-purple-700" },
    workshops: { bg: "from-green-600 to-emerald-600", light: "bg-green-100", text: "text-green-700" },
    default: { bg: "from-red-600 to-orange-600", light: "bg-red-100", text: "text-red-700" }
  };

  const colors = props.category === "concerts" ? categoryColors.concerts : props.category === "workshops" ? categoryColors.workshops : categoryColors.default;

  return (
    <div className="xl:basis-[calc(33.333%-1rem)] md:basis-[calc(50%-1rem)] basis-full group eventCard">
      <div className="h-full bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col">
        
        {/* Image Container with Overlay */}
        <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
          <Image
            src={props.image}
            alt={props.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500 brightness-95 group-hover:brightness-100"
          />
          
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Category Badge */}
          <div className="absolute top-5 left-5">
            <span className={`inline-block bg-gradient-to-r ${colors.bg} text-white text-xs font-bold rounded-full px-4 py-2 shadow-lg backdrop-blur-sm bg-opacity-90`}>
              {props.category.slice(0, -1).toUpperCase()}
            </span>
          </div>

          {/* Sold Out Badge */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">SOLD OUT</span>
            </div>
          )}

          {/* Capacity Indicator */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-semibold text-gray-800">{seatsAvailable} spots left</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col">
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
            {props.title}
          </h3>

          {/* Mini Details - Compact Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Date */}
            <div className={`${colors.light} rounded-xl p-3 flex flex-col`}>
              <span className="text-xs font-semibold text-gray-600 mb-1">DATE & TIME</span>
              <span className={`text-xs font-bold ${colors.text} line-clamp-1`}>
                {formateDate(new Date(props.date)).split(" at ")[0]}
              </span>
              <span className={`text-xs ${colors.text} opacity-80`}>
                {formateDate(new Date(props.date)).split(" at ")[1]}
              </span>
            </div>

            {/* Location */}
            <div className={`${colors.light} rounded-xl p-3 flex flex-col`}>
              <span className="text-xs font-semibold text-gray-600 mb-1">LOCATION</span>
              <span className={`text-xs font-bold ${colors.text} line-clamp-2`}>
                {props.location}
              </span>
            </div>
          </div>

          {/* Booking Progress - Enhanced */}
          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-3">
              <div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Booking Progress</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={`text-2xl font-black bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`}>
                    {bookingPercentage}%
                  </span>
                  <span className="text-xs text-gray-500">of {props.capacity} seats</span>
                </div>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full bg-gradient-to-r ${colors.bg} rounded-full transition-all duration-500 shadow-lg`}
                style={{ width: `${bookingPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Price and CTA - Flex Grow */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-end justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Price per Ticket</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`}>
                    ${props.price}
                  </span>
                </div>
              </div>
              <Link
                href={`/browse/${props._id}`}
                className={`bg-gradient-to-r ${colors.bg} text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap disabled:opacity-50 ${isSoldOut ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSoldOut ? "Sold Out" : "Get Tickets"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
