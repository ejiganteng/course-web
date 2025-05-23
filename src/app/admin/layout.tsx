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
      <div className="min-h-screen bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} />
        {children}
      </div>
    </ProtectedRoute>
  );
}