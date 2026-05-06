import { Poppins } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/ui/NavbarWrapper";
import Footer from "@/components/ui/Footer"; // Footer Import kiya
import { Suspense } from "react";

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
          min-h-screen
          flex flex-col
        `}
      >
        <NavbarWrapper />

        {/* flex-grow ensures the main content pushes the footer down 
            even if the page has very little content.
        */}
        <Suspense fallback={<div className="h-screen bg-[#FAFAFA]" />}>
          <main className="flex-grow relative">{children}</main>
        </Suspense>

        {/* Footer Added Here */}
        <Footer />
      </body>
    </html>
  );
}
