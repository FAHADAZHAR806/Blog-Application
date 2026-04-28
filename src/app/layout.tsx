import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar"; // Import the Navbar we created

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TactileBlog — Material MERN Platform",
  description: "A production-ready blog built with Next.js and MongoDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-surface text-gray-900 flex flex-col`}
      >
        {/* The Navbar stays at the top of every page */}
        <Navbar />

        {/* The 'flex-1' ensures the content fills the screen and pushes footer down if needed */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
