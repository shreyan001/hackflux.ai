'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { Search, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useWallet } from '@suiet/wallet-kit'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ContractTypes = [
  { id: 'payment-channel', name: 'Payment Channel' },
]

export default function ContractsPage() {
  const wallet = useWallet();
  const isConnected = wallet.connected;
  const [party2Address, setParty2Address] = useState('')
  const [selectedContractType, setSelectedContractType] = useState('payment-channel')
  const [party2Info, setParty2Info] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async () => {
    setIsSearching(true)
    setTimeout(() => {
      setParty2Info({
        username: 'DummyUser',
        address: '0x1234...5678',
        profilePhoto: 'https://robohash.org/dummy.png?set=set4',
      })
      setIsSearching(false)
    }, 1000)
  }

  const handleStartContract = async () => {
    if (selectedContractType === 'payment-channel') {
      const channelId = uuidv4()
      const contractDetails = {
        party1Address: wallet.address,
        party2Address: party2Info.address,
        contractType: selectedContractType,
        channelId,
      }

      try {
        console.log('Success! Contract created:', contractDetails)
        router.push(`/contracts/${channelId}`)
      } catch (error) {
        console.error('Error creating payment channel:', error)
      }
    }
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-black text-gray-300 font-mono text-center">
        <h2 className="text-3xl font-bold">Welcome to Contract Creation</h2>
        <p className="text-xl">Connect your wallet to start creating contracts.</p>
        <Button 
          onClick={() => console.log('Connect wallet placeholder')}
          className="bg-[#4da2ff] text-gray-300 px-6 py-3 rounded-md font-bold text-lg hover:bg-[#3b8edb] transition-colors border-2 border-black shadow-[0_2px_0_rgba(0,0,0,1)] mt-4"
        >
          Connect Wallet
          <ChevronRight className="w-6 h-6 ml-2" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full pl-16 bg-black text-white font-mono text-center p-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Contract</h1>

      <div className="mb-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Step 1: Select Contract Party</h2>
        <div className="flex items-center justify-center space-x-4">
          <Input
            type="text"
            value={party2Address}
            onChange={(e) => setParty2Address(e.target.value)}
            placeholder="Enter wallet address or username"
            className="flex-grow p-2 border-2 border-white bg-black text-white"
          />
          <Button
            onClick={handleSearch}
            className="bg-[#4da2ff] text-white px-4 py-2 font-bold hover:bg-[#3b8edb] transition-colors border-2 border-black shadow-[0_2px_0_rgba(0,0,0,1)]"
          >
            {isSearching ? 'Searching...' : 'Search'}
            {!isSearching && <Search className="w-4 h-4 ml-2" />}
          </Button>
        </div>
        {party2Info && (
          <div className="mt-4 p-4 bg-black text-white border-2 border-white">
            <div className="flex items-center justify-center space-x-4">
              <Image
                src={party2Info.profilePhoto}
                alt={party2Info.username}
                width={50}
                height={50}
                className="border-2 border-white"
              />
              <div>
                <p className="font-bold">{party2Info.username}</p>
                <p className="text-sm">{party2Info.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handleStartContract}
        disabled={!party2Info}
        className={`w-full max-w-xs bg-[#4da2ff] text-white rounded-none px-6 py-3 font-bold text-lg hover:bg-[#3b8edb] transition-colors border-2 border-black shadow-[0_2px_0_rgba(0,0,0,1)] ${
          !party2Info ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Start Creating Contract
        <ChevronRight className="w-6 h-6 ml-2" />
      </Button>

      {party2Info && !party2Info.isRegistered && (
        <p className="mt-4 text-sm text-red-500">
          Warning: The selected party is not registered on the platform. They must register to sign the contract.
        </p>
      )}
    </div>
  )
}
