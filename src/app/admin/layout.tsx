"use client";

import { ReactNode } from "react";
import "../public/globals.css";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {children}
        <ToastContainer theme="dark" />
      </div>
    </ProtectedRoute>
  );
}