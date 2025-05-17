"use client";

import { motion } from "framer-motion";
import { HiHome, HiUsers, HiChartBar, HiCog, HiLogout } from "react-icons/hi";
import { HiBars3 } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AdminNav() {
  const router = useRouter();
  const userId = localStorage.getItem("user_id");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout gagal");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");

      toast.success("Logout berhasil");
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error instanceof Error ? error.message : "Gagal logout");
      localStorage.clear();
      router.push("/auth");
    }
  };

  return (
    <motion.nav
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="fixed h-full w-64 flex flex-col justify-between"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-100">Admin Panel</h1>
            <p className="text-sm text-gray-400">User ID: {userId}</p>
          </div>
          <button className="lg:hidden p-2 text-gray-400 hover:text-gray-200">
            <HiBars3 className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-2">
          <a
            href="/admin"
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <HiHome className="w-5 h-5 mr-3 text-gray-400" />
            Dashboard
          </a>
          <a
            href="/admin/users"
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <HiUsers className="w-5 h-5 mr-3 text-gray-400" />
            Users
          </a>
          <a
            href="/admin/analytics"
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <HiChartBar className="w-5 h-5 mr-3 text-gray-400" />
            Analytics
          </a>
          <a
            href="/admin/settings"
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <HiCog className="w-5 h-5 mr-3 text-gray-400" />
            Settings
          </a>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors"
        >
          <HiLogout className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </motion.nav>
  );
}
