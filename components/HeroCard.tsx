import React from 'react'
import { FaResearchgate } from 'react-icons/fa'

type HeroCardProps = {
  paragraph?: string;
  header?: string;
  icon?: React.ReactNode;
}

function HeroCard({header, paragraph, icon}: HeroCardProps) {
  return (
    <div className='bg-white/10 backdrop-blur-3xl rounded-3xl p-6 w-full max-w-xs hover:scale-105 drop-shadow-neutral-100/10 shadow-2xl transition-transform'>
      {icon}
      <h3 className='text-xl my-3 font-semibold mb-2 text-white'>{header}</h3>
      <p className='text-gray-200 text-sm mb-4 pr-4'>{paragraph}</p>
    </div>
  )
}

export default HeroCard