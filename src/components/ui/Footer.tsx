import Link from "next/link";
import {
  X, // Twitter ki jagah
  Camera, // Instagram ki jagah
  GitBranch,
  Heart,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-zinc-100 font-sans mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter text-zinc-900"
            >
              LUMINA<span className="text-blue-600">.</span>
            </Link>
            <p className="mt-6 text-sm text-zinc-500 leading-relaxed max-w-sm">
              The art of digital storytelling. A decentralized space for
              thinkers and creators to share ideas that move the world.
            </p>
            <div className="flex gap-3 mt-8">
              <SocialIcon icon={<X className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Camera className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<GitBranch className="w-4 h-4" />} href="#" />
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">
                Platform
              </h3>
              <ul className="space-y-4">
                <FooterLink href="/">Explore</FooterLink>
                <FooterLink href="">Trending</FooterLink>
                <FooterLink href="">Top Authors</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">
                Resources
              </h3>
              <ul className="space-y-4">
                <FooterLink href="">About Us</FooterLink>
                <FooterLink href="">Guidelines</FooterLink>
                <FooterLink href="">Privacy</FooterLink>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">
                Newsletter
              </h3>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-0 py-2 bg-transparent border-b border-zinc-200 focus:border-blue-600 outline-none text-sm font-bold transition-all placeholder:text-zinc-300"
                />
                <button className="absolute right-0 top-1.5 text-zinc-400 hover:text-blue-600 transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[12px] font-medium text-zinc-400">
            © {currentYear} Lumina Feed. All rights reserved.
          </div>

          <div className="flex items-center gap-1 text-[12px] font-bold text-zinc-500 uppercase tracking-tighter">
            Build with{" "}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" />{" "}
            by{" "}
            <span className="text-zinc-900 border-b-2 border-blue-100">
              Fahad
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] font-bold text-zinc-500 hover:text-blue-600 transition-all flex items-center group"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300"
    >
      {icon}
    </Link>
  );
}
