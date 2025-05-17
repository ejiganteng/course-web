// components/admin/header.tsx
"use client";

import { motion } from 'framer-motion';
import { HiBell, HiChevronDown } from 'react-icons/hi2';
import { useEffect, useState } from 'react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminHeader() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        
        if (!userId || !token) {
          window.location.href = '/auth';
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Gagal memuat data user');
        }

        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <motion.header
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 left-64 bg-gray-900 shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-100">Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <HiBell className="w-6 h-6 text-gray-400" />
          </button>
          
          {loading ? (
            <div className="animate-pulse flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
              <div className="h-4 bg-gray-800 rounded w-24"></div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-gray-300 text-sm font-medium">
                  {userData?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-gray-300">
                {userData?.name || 'User'}
              </span>
              <HiChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}