import { Poppins } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/ui/NavbarWrapper";
import { Suspense } from "react";

/**
 * PERFORMANCE OPTIMIZATION:
 * We use 'variable' and 'display: swap' to prevent Layout Shift (CLS).
 * This ensures the page is readable even before the font fully loads.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Lumina Feed | The Art of Digital Storytelling",
  description:
    "A professional-grade decentralized blog platform for modern thinkers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${poppins.variable} 
          font-sans
          bg-[#FAFAFA] 
          text-zinc-900 
          antialiased 
          selection:bg-zinc-200 
          selection:text-zinc-900
        `}
      >
        {/* 
            WIX STRATEGY: 
            Navbar is wrapped in a dedicated component. 
            Ensure NavbarWrapper is a 'Client Component' but only 
            handles its own internal state to avoid re-rendering the whole layout.
        */}
        <NavbarWrapper />

        {/* 
            OPTIMIZATION: 
            Using Suspense boundaries around 'children' allows Next.js 
            to stream the page content, improving perceived speed.
        */}
        <Suspense fallback={<div className="h-screen bg-[#FAFAFA]" />}>
          <main className="min-h-screen relative">{children}</main>
        </Suspense>

        {/* 
            DESIGN NOTE: 
            In the Wix approach, we keep the DOM tree flat to improve 
            rendering performance and CSS selector speed.
        */}
      </body>
    </html>
  );
}
