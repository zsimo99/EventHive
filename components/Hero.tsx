import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import HeroCard from "./HeroCard";
import HeroSearch from "./search";
import HeroStats from "./HeroStats";
import { BsStars } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { FaAngleDoubleDown } from "react-icons/fa";

function Hero() {

  return (
    <div className="mx-auto relative min-h-svh bg-linear-to-b from-indigo-700 to-fuchsia-600  text-white">
      <div className="container relative mx-auto px-3 pt-48 md:pt-40 xl:pt-[125px] 2xl:pt-60 flex items-center md:gap-16 h-full ">
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
          <div className=" my-5">
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
        <a
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white opacity-75 hover:opacity-100"
          href="#featured"
        >
          <FaAngleDoubleDown  size={40} />
        </a>
    </div>
  );
}

export default Hero;
