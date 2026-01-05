import React from 'react'
import EventCard from './EventCard'
import EventCarousel from './EventCarousel';

async function Featured() {
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/event`, {
        // ensure this works during prerender
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.data.events)) {

        return { events: data.data.events, error: "" };
      }

      return {
        events: [],
        error: "Failed to fetch events",
      };
    } catch (error) {
      return {
        events: [],
        error: "Failed to fetch events",
      };
    }
  };

  const { events, error } = await fetchEvents();

  if (error) {
    return (
      <div className="bg-gray-100 py-32" id="featured">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-700">
          Featured Events
        </h1>
        {/* Optionally show the error text */}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-32" id="featured">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-700">
        Featured Events
      </h1>
      <div className="container mx-auto ">
        <EventCarousel events={events} />
      </div>
    </div>
  );
}

export default Featured