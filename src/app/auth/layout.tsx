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
    // Check if user is authenticated and prevent accessing auth page
    if (isAuthenticated()) {
      const role = getUserRole();
      if (role) {
        // Redirect to appropriate dashboard based on role
        router.push(getRedirectPath(role));
      } else {
        // Fallback if role is somehow missing
        router.push("/dashboard");
      }
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