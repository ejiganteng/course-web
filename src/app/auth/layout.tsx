"use client";

import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole, getRedirectPath } from "@/utils/auth-utils";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      router.push(role ? getRedirectPath(role) : "/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black">
      <main>{children}</main>
            
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}