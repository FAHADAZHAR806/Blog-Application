"use client";

import Link from "next/link";
import MaterialCard from "@/components/ui/MaterialCard";
import { LogIn, Home, Check } from "lucide-react";

export default function LogoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[420px] animate-in fade-in duration-700">
        <MaterialCard
          elevation={0}
          className="border border-gray-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] rounded-[40px] p-12 text-center"
        >
          {/* Subtle Success Indicator */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
              <Check className="w-8 h-8 text-blue-600 stroke-[3px]" />
            </div>
          </div>

          {/* Header - Wix Bold Typography */}
          <div className="space-y-4 mb-12">
            <h1 className="text-[40px] font-black text-gray-900 tracking-tighter leading-none">
              Signed Out
            </h1>
            <p className="text-gray-400 font-bold text-[14px] tracking-tight">
              See you again soon.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-5 rounded-full font-black text-[16px] tracking-tight hover:bg-black transition-all active:scale-[0.97] shadow-xl shadow-blue-50"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-5 rounded-full font-black text-[16px] tracking-tight text-gray-900 bg-gray-50 hover:bg-gray-100 transition-all active:scale-[0.97]"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
          </div>
        </MaterialCard>

        {/* Simple Brand Tagline */}
        <p className="text-center mt-10 text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
          LUMINA FEED
        </p>
      </div>
    </div>
  );
}
