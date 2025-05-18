"use client";

import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Create a dynamic page title based on the pathname
  const getPageTitle = () => {
    if (pathname === "/auth") {
      return "Login / Register";
    }
    return "Authentication";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black">
      {/* Main content area */}
      <main>{children}</main>
      
      {/* Toast notifications for messages */}
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