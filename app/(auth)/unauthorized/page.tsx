import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div  className='flex flex-col justify-center items-center h-screen text-3xl font-bold bg-gray-700 text-white'>
      Dashboard Page - Unauthorized Access
      <p>You do not have permission to view this page.</p>
      <Link href="/login" className='mt-4 text-blue-400 underline'>Go to Login</Link>
    </div>
  )
}

export default page