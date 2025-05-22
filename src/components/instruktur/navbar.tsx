"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiPieChart,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { toast } from "react-toastify";

const navItems = [
  { href: "/instruktur", icon: FiHome, label: "Dashboard" },
  { href: "/instruktur/users", icon: FiUsers, label: "Users" },
  { href: "/instruktur/course", icon: FiPieChart, label: "Course" },
  { href: "/instruktur/settings", icon: FiSettings, label: "Settings" },
];

export default function InstrukturNav() {
  const pathname = usePathname();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get data from localStorage
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setUserData((prev) => ({ ...prev, id: userId || "", role: role || "" }));

    // Fetch user details to get username
    const fetchUserData = async () => {
      if (userId && token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data && data.data) {
              setUserData((prev) => ({ ...prev, name: data.data.name }));
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
      className="fixed h-screen w-64 bg-gray-950 text-white flex flex-col shadow-xl rounded-r-4xl"
    >
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Instruktur Panel</h1>
        <div className="mt-2 text-gray-300">
          {isLoading ? (
            <p className="text-sm text-gray-400">Loading user data...</p>
          ) : (
            <>
              <p className="font-medium text-white">
                {userData.name || "Unknown User"}
              </p>
              <div className="flex items-center mt-1 text-sm text-gray-400">
                <p>ID: {userData.id || "N/A"}</p>
                {userData.role && (
                  <span className="ml-2 capitalize px-2 py-1 bg-indigo-600 rounded-md text-xs text-white">
                    {userData.role}
                  </span>
                )}
              </div>
            </>
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
