"use client";

import { motion } from "framer-motion";
import { HiHome, HiUsers, HiChartBar, HiCog, HiLogout } from "react-icons/hi";
import { HiBars3 } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

export default function AdminNav() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Jika tidak ada token, langsung redirect
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      // Handle response tidak OK
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout gagal');
      }

      // Hapus storage dan redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.success('Logout berhasil');
      router.push('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout. Silakan coba lagi.');
      
      // Force clear storage jika terjadi error
      localStorage.clear();
      router.push('/login');
    }
  };

  return (
    <motion.nav
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="fixed h-full bg-white shadow-lg w-64 flex flex-col justify-between"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button className="lg:hidden p-2">
            <HiBars3 className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-2">
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <HiHome className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <HiUsers className="w-5 h-5 mr-3" />
            Users
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <HiChartBar className="w-5 h-5 mr-3" />
            Analytics
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <HiCog className="w-5 h-5 mr-3" />
            Settings
          </a>
        </div>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 text-red-600 rounded-lg hover:bg-red-50"
        >
          <HiLogout className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </motion.nav>
  );
}
