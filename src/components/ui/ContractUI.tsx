'use client'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useWallet } from '@suiet/wallet-kit'

export function WalletTransactionDemo() {
  const wallet = useWallet();
  const isConnected = wallet.connected;
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  const handleTransaction = async () => {
    if (!isConnected) {
      console.log("Please connect your wallet to execute a transaction");
      return;
    }
 
  
  };

  return (
    <div className="w-full max-w-md bg-gray-900 text-white rounded-md overflow-hidden border border-white font-mono p-4">
      <h3 className="text-lg font-semibold mb-4">Wallet Transaction Demo</h3>
      {isConnected ? (
        <div>
          <p className="text-sm">Address: {wallet.address}</p>
          <Button 
            onClick={handleTransaction} 
            className="mt-4 bg-black text-white border border-white hover:bg-white hover:text-black transition-colors duration-200"
          >
            Execute Transaction
          </Button>
          {transactionStatus && <p className="mt-2">{transactionStatus}</p>}
        </div>
      ) : (
        <p className="text-sm">Please connect your wallet to execute a transaction.</p>
      )}
    </div>
  )
}