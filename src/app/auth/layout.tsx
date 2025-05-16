"use client";
import "../public/globals.css";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" className={`h-full ${poppins.variable}`}>
      <body className="font-poppins">
        <main>
          <div className="min-h-screen">{children}</div>
        </main>
      </body>
    </html>
  );
}