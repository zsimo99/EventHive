"use client"
import React, { use } from 'react'

function TextControl({label,type,value,setValue}: {label?: string,type:string,value:string,setValue: (value:string)=>void}) {
    const [onTop, setOnTop] = React.useState(false);
    
  return (
    <div className='relative z-0'>
        <label className={`absolute top-0 -z-10 left-0 transition-all duration-150 ${onTop ? "-translate-y-1/2 text-gray-200 text-xs":"translate-y-1/2"}`} htmlFor="">{label}</label>
        <input onSelect={()=>setOnTop(true)} onClick={()=>setOnTop(true)} onBlur={()=>value.length === 0 && setOnTop(false)} className='w-full outline-none border-b border-gray-500 py-2 ps-3' type={type} value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  )
}

export default TextControl