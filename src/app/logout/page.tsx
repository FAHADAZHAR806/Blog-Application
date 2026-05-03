"use client";

import Link from "next/link";
import MaterialCard from "@/components/ui/MaterialCard";
import { CheckCircle2, LogIn, Home } from "lucide-react"; // Modern Icons

export default function LogoutSuccessPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <MaterialCard elevation={2}>
          <div className="text-center py-8">
            {/* Animated Icon Section */}
            <div className="flex justify-center mb-8">
              <div className="relative flex items-center justify-center">
                {/* Outer Glow Effect */}
                <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-20 animate-pulse"></div>

                {/* Icon Container */}
                <div className="relative bg-white p-5 rounded-full border border-green-100 shadow-sm">
                  <CheckCircle2 className="w-14 h-14 text-green-500 stroke-[1.5px]" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-3 mb-10">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Logged Out!
              </h1>
              <p className="text-secondary text-base px-6">
                Aap kamyabi se logout ho chuke hain. Session ko secure tareeke
                se terminate kar diya gaya hai.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 px-4">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-full font-bold shadow-m3-1 hover:shadow-m3-2 transform active:scale-[0.98] transition-all duration-200"
              >
                <LogIn className="w-5 h-5" />
                Sign In Again
              </Link>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-primary border border-surface-variant hover:bg-gray-50 transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>

            {/* Security Note */}
            <div className="mt-12 pt-6 border-t border-surface-variant flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                Session Terminated Securely
              </p>
            </div>
          </div>
        </MaterialCard>
      </div>
    </div>
  );
}
