"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  const authPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/logout",
  ];

  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  if (isAuthPage) return null;

  return <Footer />;
}
