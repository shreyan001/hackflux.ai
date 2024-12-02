'use client'

import React from 'react';
import Image from 'next/image';
import { ConnectButton } from '@suiet/wallet-kit';
import localFont from 'next/font/local';


const geistMono = localFont({
  src: "../../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 border-b border-gray-800 bg-black">
      <div className={`flex items-center space-x-2`}>
        <Image src="/suisign.png" alt="Sui?.Sign Logo" width={35} height={35} />
        <span className="text-xl font-bold" style={{ fontFamily: geistMono.style.fontFamily }}>Sui?.Signature</span>
      </div>
      <ConnectButton />
    </nav>
  );
} 