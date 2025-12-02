"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="bg-linear-to-r from-purple-400/20 to-purple-700/20 shadow-xl p-2 backdrop-blur-xl fixed w-full z-10">
      <div className="container mx-auto px-3 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/images/logo.svg" alt="Logo" width={70} height={70} loading="eager" />
          <div>
            <h3 className="text-md font-bold text-gray-200">
              NexaTech Solutions
            </h3>
            <h1 className="text-xl font-semibold text-purple-300">EventHive</h1>
          </div>
        </div>
        <nav className="">
          {/* menu bar */}
          <button className="md:hidden" onClick={()=>{setIsMenuOpen(!isMenuOpen)}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <ul className={`flex items-center md:gap-4 flex-col fixed top-full left-0 w-full h-full text-2xl origin-top transition-all duration-300 md:relative md:flex-row md:scale-y-100 ${isMenuOpen ? "flex scale-y-100" : "scale-y-0"}`}>
            <li className="link_item"><Link href="/">Home</Link></li>
            <li className="link_item"><Link href="/browse">Browse</Link></li>
            <li className="link_item"><Link href="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
