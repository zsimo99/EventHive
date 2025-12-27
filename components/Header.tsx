"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { logout } from "@/lib/authSlice";
import { IoIosLogOut } from "react-icons/io";
import UserIcon from "./UserIcon";

// Private routes that require authentication
const privateRoutes = ["/dashboard"];

const navItems = [
  { name: "concerts", path: "/browse?category=concerts" },
  { name: "workshops", path: "/browse?category=workshops" },
  { name: "conferences", path: "/browse?category=conferences" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, user } = useSelector((state: any) => state.auth);

  // Close menu when route changes or on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const logoutfunc = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Logout successful");
        dispatch(logout());
        setIsMenuOpen(false);
        
        // Redirect to unauthorized if on a private route
        const isOnPrivateRoute = privateRoutes.some((route) =>
          pathname.startsWith(route)
        );
        if (isOnPrivateRoute) {
          router.push("/unauthorized");
        }
      } else throw new Error();
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-gradient-to-r from-purple-800/60 to-purple-700/60 shadow-lg backdrop-blur-xl fixed w-full z-50">
      <div className="container mx-auto px-4 flex justify-between items-center py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1" onClick={closeMenu}>
          <Image src="/images/logo.svg" alt="Logo" width={60} height={60} />
          <div className="font-poppins">
            <h3 className="text-xs font-bold text-gray-200 hidden sm:block">
              NexaTech Solutions
            </h3>
            <h1 className="text-lg sm:text-xl font-semibold text-purple-300">EventHive</h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.name} className="link_item">
                <Link href={item.path} className="capitalize text-gray-200 hover:text-purple-300 transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <p className="text-gray-200 text-sm">Welcome, {user?.userName}</p>
              <UserIcon logout={logoutfunc} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-200 hover:text-blue-300 transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden relative z-50 p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span
              className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                isMenuOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/80 w-screen h-screen backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{ top: "0" }}
          onClick={closeMenu}
        />

        {/* Mobile Menu Panel */}
        <nav
          className={`lg:hidden fixed top-0 right-0 h-full w-[280px] max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out z-40 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-20 pb-8 px-6  ">
            {/* User Info (if logged in) */}
            {isLoggedIn && (
              <div className="mb-6 pb-6 border-b border-purple-700/50">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-semibold">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.userName}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{user?.userName?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{user?.userName}</p>
                    <p className="text-purple-300 text-xs capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/browse"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-purple-800/50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Events
                </Link>
              </li>
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-purple-800/50 transition-colors capitalize"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {item.name}
                  </Link>
                </li>
              ))}
              
              {isLoggedIn && (
                <li>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-purple-800/50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Auth Actions */}
            <div className="space-y-3 pt-6 border-t border-purple-700/50">
              {isLoggedIn ? (
                <button
                  onClick={logoutfunc}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <IoIosLogOut className="text-xl" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="w-full flex items-center justify-center gap-2 bg-purple-700 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
