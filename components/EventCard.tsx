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
  return (
    <div className="xl:basis-[calc(33.333%-1rem)] md:basis-[calc(50%-1rem)] basis-full  bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 eventCard">
      <div className="relative w-full h-48">
        <Image
          src={props.image}
          alt={props.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute w-full top-4 left-0 px-4 text-white text-[13px] flex justify-between gap-1">
          <span
        className={`rounded-2xl px-2 py-0.5 ${
          props.category == "concerts"
            ? "bg-purple-600/70"
            : props.category == "workshops"
            ? "bg-green-600/70"
            : "bg-red-500/70"
        }`}
          >
        {props.category.slice(0, -1)}
          </span>
          <span className="bg-indigo-600/70 rounded-2xl px-2 py-0.5">
        Featured
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{props.title}</h3>
        <div className="text-gray-600 flex items-center gap-2 text-sm mb-2">
          <IoCalendarClearOutline />
          <span>{formateDate(new Date(props.date))}</span>
        </div>
        <div className="text-gray-600 flex items-center gap-2 text-sm mb-2">
          <IoLocationOutline />
          <span>{props.location}</span>
        </div>
        <div className="text-gray-600 flex items-center gap-2 text-sm mb-2">
          <IoPersonOutline />
          <span>{props.capacity - props.booked} seats available</span>
        </div>
        <div className="px-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              {((props.bookedSeats  * 100) / props.capacity).toFixed(0)}% booked
              
            </span>
            <span>
              {props.bookedSeats} / {props.capacity}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
            <div
              className="h-2 bg-indigo-600 rounded-full"
              style={{ width: `${(props.bookedSeats / props.capacity) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="px-2 mt-4 flex justify-between items-center">
          <p className="text-gray-900 text-xl flex items-end">
            <span className="text-3xl text-indigo-600">
              <FiDollarSign />
            </span>
            {props.price}
          </p>
          <Link href={`/browse/${props._id}`} className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors duration-300">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
