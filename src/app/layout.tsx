import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";
import { EndpointsContext } from "@/app/agent";
import { SidebarProvider } from '@/lib/context/SidebarContext';
import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/ui/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EscrowGuild",
  description: "Escrow Guild is a platform to leverage AI Agents for your web3 adventures",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <Providers>
            <Navbar />
            <div className="flex h-screen pt-16">
              <Sidebar className="flex-shrink-0" />
              <div className="flex flex-1 flex-col">
                <EndpointsContext>
                  <main className="flex-1 overflow-auto">
                    {children}
                  </main>
                </EndpointsContext>
              </div>
            </div>
          </Providers>
        </SidebarProvider>
      </body>
    </html>
  );
}
