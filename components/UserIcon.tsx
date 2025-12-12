import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { FaRegUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";

function UserIcon({ logout }: { logout: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        console.log("clicked outside");
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);
  return (
    <div
      ref={menuRef}
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="text-gray-200 text-lg flex items-center gap-2 cursor-pointer relative"
    >
      <div className="relative border-2 p-2 rounded-full border-gray-200/60 block">
        <FaRegUser />
        <span className="absolute border-10 border-transparent border-t-gray-200/60 -right-5 -bottom-2.5" />
      </div>
      <ul
        className={`absolute bottom-0 text-[16px] right-0 font-semibold rounded-xl overflow-hidden w-44 translate-y-full translate-x-3  bg-gray-950/70 backdrop-blur-3xl origin-top transition-all duration-300 flex flex-col ${
          isMenuOpen ? "scale-y-100" : "scale-y-0"
        }`}
      >
        <li> <Link href="/dashboard" className="hover:bg-blue-400/50 w-full py-2 px-4 flex items-center justify-between">
          Dashboard <MdDashboard />
        </Link></li>
        <li> <Link href="/settings" className="hover:bg-blue-400/50 w-full py-2 px-4 flex items-center justify-between">
          Settings <IoMdSettings />
        </Link></li>
        <li onClick={logout} className="hover:bg-red-500/60  w-full py-2 px-4 flex items-center justify-between">
          Logout
          <RiLogoutBoxLine className="" />

        </li>
      </ul>
    </div>
  );
}

export default UserIcon;
