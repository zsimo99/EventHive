import { events } from '@/data/events'
import React from 'react'
import EventCard from './EventCard'

async function Featured() {
  const fetchEvents=async()=>{
    try {
      const res=await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/event`)
      const data=await res.json()
      if(data.success){
        return data.data
      }
    } catch (error) {
      return {events:[],totalCount:0,error:"Failed to fetch events"}
    }
  }
  const {events,error=""}:any =await fetchEvents()

  if(error){
    return <div className='bg-gray-100 py-32 ' id='featured'>
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-700">Featured Events</h1>
    </div>
  }
  if(events) return (
    <div className='bg-gray-100 py-32 ' id='featured'>
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-700">Featured Events</h1>
        <div className='container mx-auto px-4 flex flex-wrap gap-4 justify-start'>
            {events.map((e:any)=>(
                <EventCard key={e._id} booked={20} {...e} />
            ))}
        </div>
    </div>

  )
}

export default Featured