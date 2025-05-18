"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole = [],
  redirectTo = "/auth",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Check if role requirements are met
        if (requiredRole) {
          const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
          
          if (requiredRoles.length > 0 && (!userRole || !requiredRoles.includes(userRole))) {
            toast.error("Anda tidak memiliki akses ke halaman ini");
            throw new Error("Unauthorized: Insufficient permissions");
          }
        }

        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}