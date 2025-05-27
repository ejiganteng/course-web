"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import AdminNav from '@/components/admin/navbar';
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminNav />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Content */}
        <div className="relative z-10">
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
            className="mr-4 lg:mr-0 text-sm font-medium"
            toastClassName="backdrop-blur-lg bg-white/95 border border-white/20 shadow-2xl rounded-2xl text-gray-800"
            progressClassName="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}