'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserRole, getRedirectPath } from '@/utils/auth-utils';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectPath = '/auth'
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check if we're on the client side
      if (typeof window === 'undefined') return;
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push(redirectPath);
        return;
      }

      // Get user role
      const userRole = getUserRole();
      
      // If specific roles are required, check if user has permission
      if (allowedRoles.length > 0) {
        if (userRole && allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          // Redirect to appropriate dashboard based on role
          router.push(userRole ? getRedirectPath(userRole) : '/dashboard');
          return;
        }
      } else {
        // No specific roles required, just need to be authenticated
        setIsAuthorized(true);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router, allowedRoles, redirectPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-3 font-bold text-gray-300">Memuat...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}