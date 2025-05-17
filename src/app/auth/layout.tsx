"use client";
import "../public/globals.css";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
        <div className="min-h-screen">{children}</div>
  );
}
