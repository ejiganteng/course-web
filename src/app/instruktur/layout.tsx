"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import InstrukturNav from '@/components/instruktur/navbar';
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function InstrukturLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["instruktur"]}>
      <InstrukturNav />
      <div className="h-full bg-gray-100 text-black">
        <ToastContainer position="top-right" autoClose={3000} />
        {children}
      </div>
    </ProtectedRoute>
  );
}