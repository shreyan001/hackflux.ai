'use client'

import React from 'react'
import { useParams } from 'next/navigation'

export default function ContractDetailsPage() {
  const params = useParams()
  const contractData = params.data // Get the dynamic route parameter

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-8">Contract Details</h1>
        
        <div className="border-2 border-white p-8 rounded-lg">
          <h2 className="text-xl mb-4">Contract ID: {contractData}</h2>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              Loading contract details for ID: {contractData}...
            </p>
            
            {/* Add more contract details here once fetched */}
          </div>
        </div>
      </div>
    </div>
  )
}
