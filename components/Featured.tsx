import { events } from '@/data/events'
import React from 'react'
import EventCard from './EventCard'

function Featured() {
  return (
    <div className='bg-gray-100 py-32 ' id='featured'>
        <div className='container mx-auto px-4 flex flex-wrap gap-4 justify-start'>
            {events.map((e)=>(
                <EventCard key={e.id} {...e} />
            ))}
        </div>
    </div>
  )
}

export default Featured