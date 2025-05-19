'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getRedirectPath } from '@/utils/auth-utils';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check if we're on the client side
      if (typeof window === 'undefined') return;
      
      // Get token and role from localStorage
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      
      // If no token exists, redirect to login
      if (!token) {
        router.push('/auth');
        return;
      }
      
      // If there are allowedRoles specified, check if the user's role is included
      if (allowedRoles.length > 0) {
        if (userRole && allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          // If the user doesn't have the correct role, redirect to appropriate page
          router.push(getRedirectPath(userRole || 'user'));
          return;
        }
      } else {
        // If no specific roles are required, just check for token
        setIsAuthorized(true);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
}