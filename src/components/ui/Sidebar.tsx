'use client'
import React, { useState } from 'react';
import { Bell, FileText, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/lib/context/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import localFont from 'next/font/local';

const geistMono = localFont({
  src: "../../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const { activePage, setActivePage } = useSidebar();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sidebarItems = [
    { icon: Home, key: 'dashboard', path: '/', tooltip: 'Dashboard', description: 'Go to dashboard' },
    { icon: FileText, key: 'contracts', path: '/contracts', tooltip: 'Contracts', description: 'Manage contracts' },
    { icon: Bell, key: 'notifications', path: '/notifications', tooltip: 'Notifications', description: 'View notifications' },
  ];

  const handleClick = async (key: string, path: string) => {
    setIsLoading(true);
    setActivePage(key);
    await router.push(path);
    setIsLoading(false);
  };

  return (
    <div className={`w-20 bg-[#4da2ff] text-white flex flex-col items-center justify-center space-y-6 border-r border-gray-800 fixed left-0 top-0 h-full ${className}`}>
      <div className="bg-black border border-gray-800 shadow-md p-2">
        {sidebarItems.map((item) => (
          <div 
            key={item.key} 
            className="relative mb-4 last:mb-0"
            onMouseEnter={() => setHoveredItem(item.key)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button
              onClick={() => handleClick(item.key, item.path)}
              disabled={isLoading}
              className={`p-2 hover:bg-white hover:text-black transition-colors ${
                activePage === item.key ? 'bg-white text-black' : 'bg-black text-white'
              } border border-gray-800 shadow-sm hover:shadow-md active:shadow-none flex items-center justify-center w-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <item.icon className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="absolute top-0 left-full w-4 h-full" />
            <AnimatePresence>
              {hoveredItem === item.key && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute left-full top-0 ml-4 bg-black text-white py-1 px-2 z-50 w-28 border border-gray-800 shadow-md"
                >
                  <p className="font-bold text-xs mb-0.5" style={{ fontFamily: geistMono.style.fontFamily }}>{item.tooltip}</p>
                  <p className="text-[9px] leading-tight" style={{ fontFamily: geistMono.style.fontFamily }}>{item.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
} 