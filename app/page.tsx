import HeroCard from "@/components/HeroCard";
import HeroSearch from "@/components/HeroSearch";
import HeroStats from "@/components/HeroStats";
import React from "react";
import { BsStars } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";

function page() {
  return (
    <div className="mx-auto min-h-screen bg-linear-to-b from-indigo-700 to-fuchsia-600  text-white">
      <div className="container mx-auto px-3 pt-32 md:pt-40 xl:pt-48 2xl:pt-48 flex items-center md:gap-16 h-full">
        <div className="flex-1 max-md:basis-6/12 h-full ">
          <h4 className="flex max-lg:mx-auto bg-gray-200/10 w-fit px-3 py-1 rounded-full items-center gap-2 text-xs md:text-md mb-4">
            <BsStars />
            Discover Amazing Experiences
          </h4>
          <h1 className="text-3xl md:text-[40px] xl:text-[43px] text-center lg:text-start mb-8 text-shadow-lg font-semibold leading-tight">
            Find Your Next <br className="max-lg:hidden" />
            Unforgettable Event
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-center lg:text-start font-thin">
            Connect with concerts, workshops, and conferences that inspire you.
            Book instantly and manage everything in one place.
          </p>
          <div className="max-lg:px-10 my-5">
            <HeroSearch />
          </div>
          <HeroStats />
        </div>
        <div className="flex flex-1 flex-col gap-4 max-md:basis-6/12 max-lg:hidden h-full ">
          <div className="  flex gap-4">
            <HeroCard
              paragraph="Book events instantly with just a few clicks"
              header="Easy Booking"
              icon={<CiCalendar size={40} fontSize={300} />}
            />
            <HeroCard
              paragraph="Handpicked events for every interest

"
              header="Curated Selection"
              icon={<FaLocationDot size={40} fontSize={300} />}
            />
          </div>
          <div className="flex-1 h-full max-lg:hidden flex gap-4">
            <HeroCard
              paragraph="Discover events near you or around the world"
              header="Local & Global"
              icon={<BsStars size={40} fontSize={300} />}
            />
            <HeroCard
              paragraph="Find exactly what you're looking for"
              header="Smart Search"
              icon={<IoIosSearch size={40} fontSize={300} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
