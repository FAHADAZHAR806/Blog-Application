import { Poppins } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/ui/NavbarWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Lumina | Share Your Perspective",
  description: "A premium space for high-quality thoughts and articles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-[#F8F9FA] text-[#2D3436] antialiased`}
      >
        <NavbarWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}
