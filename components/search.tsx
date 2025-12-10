"use client"
import { useRouter } from "next/navigation"
import React from "react"
import { IoIosSearch } from "react-icons/io"

function HeroSearch() {
  const router =  useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")
  return (
    <div className="bg-gray-50 ps-5 p-2 rounded-xl flex items-center mt-4 shadow-lg">
        <IoIosSearch size={35} className="text-gray-500 block "/>
        <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} type="text" className="w-full p-2 rounded-md outline-none focus:border-none  text-gray-900 text-sm xl:text-xl" placeholder="Search for events..." />
        <button onClick={() => router.push(`/browse?search=${searchTerm}`)} className="ml-2 bg-indigo-600 text-white px-4 py-2 xl:py-3 xl:px-9 text-sm xl:text-base rounded-xl hover:bg-indigo-700 whitespace-nowrap ">Explore events</button>
    </div>
  )
}

export default HeroSearch