// dashboard/settings/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.push("/"); // Ya jahan aap user ko bhejna chahte hain
  }, []);
  return null;
}
