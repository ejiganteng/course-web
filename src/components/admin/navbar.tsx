// components/admin/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FiHome, FiUsers, FiPieChart, FiSettings, FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";

const navItems = [
  { href: "/admin", icon: FiHome, label: "Dashboard" },
  { href: "/admin/users", icon: FiUsers, label: "Users" },
  { href: "/admin/analytics", icon: FiPieChart, label: "Analytics" },
  { href: "/admin/settings", icon: FiSettings, label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        localStorage.clear();
        toast.success("Logout berhasil");
        window.location.href = "/auth";
      }
    } catch (error) {
      toast.error("Gagal logout");
    }
  };

  return (
    <motion.nav
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed h-screen w-64 bg-gray-800 text-white flex flex-col shadow-xl"
    >
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="mt-2 text-sm text-gray-400">
          <p>{userId ? `ID: ${userId}` : "Loading..."}</p>
          {role && (
            <span className="capitalize px-2 py-1 bg-indigo-600 rounded-md text-xs">
              {role}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </motion.nav>
  );
}