import EventCard from "@/components/EventCard";
import HeroSearch from "@/components/search";
import Link from "next/link";
import React from "react";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ category: string; search: string; page: string }>;
}) {
  const { category, search, page="1" } = await searchParams;
  const fetchEvents = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/event?category=${
          category || ""
        }&search=${search || ""}&page=${page || 1}`
      );
      const data = await res.json();
      if (data.success) {
        return { events: data.data.events, totalCount: data.data.totalCount,error:""};
      }
      else{
        throw new Error("Failed to fetch events");
      }
    } catch (error) {
      return { events: [], totalCount: 0, error: "Failed to fetch events" };
    }
  };
  const { error, events=[], totalCount } = await fetchEvents();
  if (error) {
    return (
      <div className="bg-gray-200 min-w-screen flex justify-center items-center py-32">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }
  return (
    <div className="bg-gray-200 min-w-screen pt-16 pb-32">
      <div className="container mx-auto px-4 py-16 ">
        <div className="flex gap-4 items-center mb-8 justify-between">
            <h1 className="text-2xl">{search?  <>Search for <span className="text-indigo-700">{search}</span></> :  "all events"}</h1>
            <HeroSearch/>
        </div>
        <div className="flex flex-wrap gap-4 justify-start">
          {events.map((e: any) => (
            <EventCard key={e._id} booked={20} {...e} />
          ))}
        </div>
        <div className="text-indigo-700 font-semibold mt-3 text-lg">Total: {totalCount}</div>
        <div className="flex justify-center mt-8 gap-2">
          {/* todo fix pagination logic */}
           <Link  href={`/browse?page=${parseInt(page)<=1?1:parseInt(page)-1}&search=${search || ""}&category=${category || ""}`} className={`px-4 py-2 bg-indigo-700 text-white rounded-2xl text-center hover:bg-indigo-800  ${parseInt(page) <= 1 && "opacity-50 cursor-not-allowed "}`}>{"<"}</Link>
            <span className="px-4 py-2 text-indigo-700 font-semibold">Page {parseInt(page)}/{Math.ceil(totalCount/10)}</span>
          <Link href={`/browse?page=${ parseInt(page) >= Math.ceil(totalCount/10) ? Math.ceil(totalCount/10) : parseInt(page)+1}&search=${search || ""}&category=${category || ""}`} className={`px-4 py-2 bg-indigo-700 text-white rounded-2xl text-center hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed ${parseInt(page) >= Math.ceil(totalCount/10) && "opacity-50 cursor-not-allowed"}`}>{">"}</Link>
        </div>
      </div>
    </div>
  );
}

export default page;
