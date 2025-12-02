import React from 'react'

function HeroStats() {
  return (
    <div className='flex justify-center gap-4 md:gap-10 items-center text-2xl md:text-3xl text-gray-50'>
        <div className='flex flex-col items-center'>
            <h2 className='text-shadow-2xs'>10K+</h2>
            <p className='text-xs xl:text-base text-gray-100 font-light'>Active Events</p>
        </div>
        <div className='flex flex-col items-center'>
            <h2 className='text-shadow-2xs'>500K+</h2>
            <p className='text-xs xl:text-base text-gray-100 font-light'>Happy Attendees</p>
        </div>
        <div className='flex flex-col items-center'>
            <h2 className='text-shadow-2xs'>1K+</h2>
            <p className='text-xs xl:text-base text-gray-100 font-light'>Organizers</p>
        </div>
    </div>
  )
}

export default HeroStats