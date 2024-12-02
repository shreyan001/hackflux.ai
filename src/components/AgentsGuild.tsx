'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Search, Wallet } from 'lucide-react'
import { AIMessageText, HumanMessageText } from "@/components/ui/message"
import { EndpointsContext } from '@/app/agent'
import { useActions } from '@/ai/client'
import { useRouter } from 'next/navigation'
import {useWallet } from '@suiet/wallet-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';




export function AgentsGuildInterface() {
  const wallet = useWallet();
  const isConnected = wallet.connected;
  const actions = useActions<typeof EndpointsContext>();
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<[role: string, content: string][]>([
    ["human", "Hello!"],
    ["ai", "Welcome to Agents Guild! How can I assist you today?"]
  ]);
  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID;

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [elements]); // This will trigger whenever elements change

  const checkStamps = async (walletAddress: string, packageId: string) => {
    try {
      const client = new SuiClient({ url: getFullnodeUrl('devnet') });
      const objects = await client.getOwnedObjects({
        owner: walletAddress,
        filter: {
          StructType: `${packageId}::signature_stamp::SignatureStamp`
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
  };

  useEffect(() => {
    const checkSignatureStamp = async () => {
      if (!isConnected || !wallet.address) return;

      const hasValidStamp = await checkStamps(wallet.address, PACKAGE_ID);
      if (!hasValidStamp) {
        router.push('/mint');
      }
    };

    checkSignatureStamp();
  }, [isConnected, wallet.address, router, PACKAGE_ID]);

  const handleSend = async () => {
    if (!isConnected) {
      // Optionally, you can show a message to the user here
      console.log("Please connect your wallet to chat");
      return;
    }

    const newElements = [...elements];
    
    const humanMessageRef = React.createRef<HTMLDivElement>();
    newElements.push(
      <div className="flex flex-col items-end w-full gap-1 mt-auto" key={history.length} ref={humanMessageRef}>
        <HumanMessageText content={input} />
      </div>
    );
    
    setElements(newElements);
    setInput("");

    // Scroll to the human message
    setTimeout(() => {
      humanMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const element = await actions.agent({
      chat_history: history,
      input: input
    });

    const aiMessageRef = React.createRef<HTMLDivElement>();
    setElements(prevElements => [
      ...prevElements,
      <div className="flex flex-col gap-1 w-full max-w-fit mr-auto" key={history.length + 1} ref={aiMessageRef}>
        {element.ui}
      </div>
    ]);

    // Scroll to show the top of the AI message
    setTimeout(() => {
      aiMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[95%] w-full bg-black text-white font-mono pt-16">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-xl font-bold">Checking your signature profile...</p>
            <p className="text-sm">Please wait while we verify your access.</p>
          </div>
        </div>
      ) : (
        <div className="flex overflow-hidden ml-12">
          <div className=" ml-12 w-[20%] bg-[#4da2ff] text-white p-2 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Sui?.Signature Dashboard</h1>
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-1">Recent Projects</h2>
              <ul className="space-y-1">
                {["Next.js Integration", "DeFi Market Analysis", "OpenAI SDK Implementation"].map((project, index) => (
                  <li key={index} className="bg-black text-white p-1">
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex-1 flex flex-col border p-1 border-gray-800 mx-5">
            <div className="flex items-center justify-between p-2 border-b border-gray-800">
              <div className="flex items-center space-x-1">
                <Button className="bg-black text-white border border-white rounded-md px-2 py-1 text-xs hover:bg-white hover:text-black transition-colors">
                  Menu
                </Button>
                <Select>
                  <SelectTrigger className="w-[170px] bg-black text-white border text-sm border-white rounded-md">
                    <SelectValue placeholder="Select Contract" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white border-gray-800">
                    <SelectItem value="current">Current Project</SelectItem>
                    <SelectItem value="nextjs">Next.js Integration</SelectItem>
                    <SelectItem value="defi">DeFi Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-1">
                <Input 
                  placeholder={isConnected ? "Search for a receipt..." : "Connect wallet to chat"} 
                  className="bg-black text-white border-gray-800 rounded-md"
                  disabled={!isConnected}
                />
                <Button className={`bg-black text-white border border-white rounded-md px-3 py-1 text-xs hover:bg-white hover:text-black transition-colors flex items-center space-x-1 ${!isConnected && 'opacity-50 cursor-not-allowed'}`} disabled={!isConnected}>
                  <Search className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-100px)]">
              <div className="flex flex-col w-full gap-1 p-2">
               {elements}
              </div>
            </ScrollArea>
            <div className="p-2 border-t border-gray-800">
              <div className="flex space-x-1">
                <Input
                  placeholder={isConnected ? "Set up a payment reciept..." : "Connect wallet to chat"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && isConnected && handleSend()}
                  className="bg-black text-white border-gray-800 rounded-md flex-grow"
                  disabled={!isConnected}
                />
                <Button 
                  onClick={handleSend} 
                  className={`bg-black text-white border border-white rounded-md px-3 py-1 text-xs hover:bg-white hover:text-black transition-colors flex items-center space-x-1 ${!isConnected && 'opacity-50 cursor-not-allowed'}`}
                  disabled={!isConnected}
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}