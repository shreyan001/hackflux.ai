'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { useRouter } from 'next/navigation';
import { Dancing_Script, Great_Vibes } from 'next/font/google';

    const dancingScript = Dancing_Script({ 
        subsets: ['latin'],
        display: 'swap',
      });
      
      const greatVibes = Great_Vibes({
        weight: '400',
        subsets: ['latin'],
        display: 'swap',
      });
export default function MintPage() {

  const wallet = useWallet();
  const router = useRouter();
  const [signatureName, setSignatureName] = useState('');
  const [previewStyle, setPreviewStyle] = useState({
    transform: 'scale(1)',
    opacity: 1
  });
  const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID;
  const REGISTRY_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
  const [isLoading, setIsLoading] = useState(false);

  const checkStamps = useCallback(async () => {
    try {
      const client = new SuiClient({ url: getFullnodeUrl('devnet') });
      const objects = await client.getOwnedObjects({
        owner: wallet.address!,
        filter: {
          StructType: `${PACKAGE_ID}::signature_stamp::SignatureStamp`
        },
        options: {
          showContent: true,
          showType: true,
          showOwner: true
        }
      });

      if (objects.data.length > 0) {
        console.log('Signature stamp found, redirecting...');
        router.push('/');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error checking stamps:', e);
      return false;
    }
  }, [wallet.address, PACKAGE_ID, router]);

  // Add signature animation effect
  useEffect(() => {
    const checkForStamps = async () => {
      if (wallet.connected && wallet.address) {
        const hasStamps = await checkStamps();
        if (hasStamps) return;
      }

      setPreviewStyle({
        transform: 'scale(1.05)', 
        opacity: 0.8
      });
      const timer = setTimeout(() => {
        setPreviewStyle({
          transform: 'scale(1)',
          opacity: 1
        });
      }, 150);
      return () => clearTimeout(timer);
    };

    checkForStamps();
  }, [signatureName, wallet.connected, wallet.address, checkStamps]);

  async function handleMintSignatureNFT() {
    if (!wallet.connected) {
      alert('Please connect your wallet to mint your signature stamp.');
      return;
    }

    if (!signatureName.trim()) {
      alert('Please enter your signature name.');
      return;
    }

    setIsLoading(true);
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::signature_stamp::mint_stamp`,
      arguments: [
        tx.object(REGISTRY_ID),
        tx.pure.string(signatureName)
      ],
    });

    try {
      const resData = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });
      console.log('Stamp minted successfully!', resData);
      
      // Wait for transaction confirmation and check for object
      let attempts = 0;
      const maxAttempts = 10;
      const checkInterval = setInterval(async () => {
        attempts++;
        const hasStamp = await checkStamps();
        if (hasStamp) {
          clearInterval(checkInterval);
          setIsLoading(false);
          alert('Congrats! Your signature stamp is minted!');
          router.push('/');
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          setIsLoading(false);
          alert('Transaction completed but stamp not found. Please refresh the page.');
        }
      }, 2000); // Check every 2 seconds

    } catch (e) {
      console.error('Stamp mint failed', e);
      setIsLoading(false);
      alert('Failed to mint stamp. Please try again.');
    }
  }

  return (
    <div className="h-full w-full bg-black text-white font-mono">
      <div className="max-w-2xl mx-auto p-8 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-[#4da2ff]">Mint Your Signature Stamp</h1>
        
        <div className="w-full space-y-6 bg-[#111] p-8 border border-gray-800">
          <p className="text-center text-gray-300">
            This signature stamp will be used to verify your transactions.
            Enter the name you want to use as your signature.
          </p>

          <input
            type="text"
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
            placeholder="Enter your signature name"
            className="w-full p-3 bg-black text-white border border-gray-800 focus:border-[#4da2ff] outline-none transition-all"
          />

          {signatureName && (
            <div 
              className="h-48 flex items-center justify-center border border-gray-800 my-6 bg-[#0a0a0a]"
              style={{
                transition: 'all 0.15s ease-out',
                ...previewStyle
              }}
            >
              <span 
                className="text-5xl font-signature text-[#4da2ff]" 
                style={{ 
                  fontFamily: `${dancingScript.style.fontFamily}`,
                  textShadow: '0 0 1px rgba(77, 162, 255, 0.3)',
                  letterSpacing: '2px',
                  transform: 'rotate(-5deg)',
                  backgroundImage: 'linear-gradient(45deg, #4da2ff, #66b3ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {signatureName}
              </span>
            </div>
          )}

          <button 
            onClick={handleMintSignatureNFT} 
            disabled={!wallet.connected || !signatureName.trim() || isLoading}
            className="w-full p-3 bg-[#4da2ff] text-black font-bold hover:bg-[#3a89e6] transition-colors disabled:bg-gray-700 disabled:text-gray-500 border border-[#4da2ff]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Minting...
              </span>
            ) : (
              'Mint Your Signature Stamp'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
