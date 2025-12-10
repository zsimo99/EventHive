"use client";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "@/lib/authSlice";
import { IoIosLogOut } from "react-icons/io";
import UserIcon from "./UserIcon";

const navItems = [
  { name: "concerts", path: "/browse?category=concerts" },
  { name: "workshops", path: "/browse?category=workshops" },
  { name: "conferences", path: "/browse?category=conferences" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state: any) => state.auth);
  console.log("user in header:", user);
  // const isLoggedIn =true
  const logoutfunc = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Logout successful");
        dispatch(logout());
      } else throw new Error();
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  return (
    <header className="bg-linear-to-r from-purple-800/60 to-purple-700/60 shadow-lg backdrop-blur-xl fixed w-full z-10">
      <div className="container mx-auto px-3 flex justify-between items-center relative py-1 shadow-2xl shadow-purple-900/50">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.svg" alt="Logo" width={70} height={70} />
          <div className="font-poppins">
            <h3 className="text-md font-bold text-gray-200">
              NexaTech Solutions
            </h3>
            <h1 className="text-xl font-semibold text-purple-300">EventHive</h1>
          </div>
        </Link>
        {/* phone nav  */}
        <nav className=" lg:hidden">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h- 6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                color="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="lg:hidden">
            <ul
              className={`absolute bottom-0 left-0 w-full translate-y-full p-4 gap-4 bg-purple-800/90  backdrop-blur-sm text-lg origin-top transition-all duration-300 flex flex-col ${
                isMenuOpen ? "scale-y-100" : "scale-y-0"
              }`}
            >
              {navItems.map((item) => (
                <li key={item.name} className="link_item">
                  <Link href={item.path}>{item.name}</Link>
                </li>
              ))}
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    className="text-gray-200 hover:text-blue-300 transition-colors text-left"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <button
                  onClick={logoutfunc}
                  className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  <IoIosLogOut />
                  Logout
                </button>
              )}
            </ul>
          </div>
        </nav>
        {/* pc nav  */}
        <nav className=" max-lg:hidden">
          <ul className="flex items-center lg:gap-6">
            {navItems.map((item) => (
              <li key={item.name} className="link_item">
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="max-lg:hidden flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <p className="text-gray-200">welcome back {user?.userName}</p>
              <UserIcon logout={logoutfunc} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-200 hover:text-blue-300 transition-colors px-4 py-2 text-left"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
/*
<div className="container mx-auto px-3 flex justify-between items-center">
  <div className="flex items-center">
    <Image
      src="/images/logo.svg"
      alt="Logo"
      width={70}
      height={70}
      loading="eager"
    />
    <div>
      <h3 className="text-md font-bold text-gray-200">NexaTech Solutions</h3>
      <h1 className="text-xl font-semibold text-purple-300">EventHive</h1>
    </div>
  </div>
  <nav className="">
    <button
      className="md:hidden"
      onClick={() => {
        setIsMenuOpen(!isMenuOpen);
      }}
    >
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
    <ul
      className={`flex items-center md:gap-4 flex-col fixed top-full left-0 w-full h-full text-2xl origin-top transition-all duration-300 md:relative md:flex-row md:scale-y-100 ${
        isMenuOpen ? "flex scale-y-100" : "scale-y-0"
      }`}
    >
      <li className="link_item">
        <Link href="/">Home</Link>
      </li>
      <li className="link_item">
        <Link href="/browse">Browse</Link>
      </li>
      <li className="link_item">
        <Link href="/dashboard">Dashboard</Link>
      </li>
    </ul>
  </nav>
</div>;
*/
