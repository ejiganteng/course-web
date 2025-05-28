"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiUsers, FiPieChart, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const navItems = [
  { href: "/instruktur", icon: FiHome, label: "Dashboard"},
  { href: "/instruktur/users", icon: FiUsers, label: "Users"},
  { href: "/instruktur/course", icon: FiPieChart, label: "Course"},
  { href: "/instruktur/settings", icon: FiSettings, label: "Settings"},
];

export default function InstrukturNav() {
  const pathname = usePathname();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    role: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    setUserData(prev => ({ ...prev, id: userId || "", role: role || "" }));

    const fetchUserData = async () => {
      if (userId && token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.data) {
              setUserData(prev => ({ ...prev, name: data.data.name }));
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
    <>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-lg"
      >
        {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
          translateX: isMobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
        }}
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 rounded-r-4xl text-white flex flex-col shadow-2xl border-r border-gray-700/50 backdrop-blur-xl z-50  ${
          isMobileMenuOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'
        }`}
      >
        <div className="relative z-20 p-6 border-b border-gray-700/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-xl font-bold text-white">
              Instruktur Panel
            </h1>
            <div className="mt-3 space-y-2">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="font-semibold text-white text-sm">
                    {userData.name || "Unknown User"}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      ID: {userData.id || "N/A"}
                    </span>
                    {userData.role && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="capitalize px-2 py-1 bg-indigo-500 rounded-md text-white shadow-lg"
                      >
                        {userData.role}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="relative z-20 flex-1 p-4 space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`relative group flex items-center p-3 rounded-xl transition-all duration-300 overflow-hidden ${
                    isActive
                      ? "bg-indigo-500/20 text-white shadow-lg"
                      : "hover:bg-gray-700/50 text-gray-300 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-indigo-500/10 rounded-xl"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  
                  <AnimatePresence>
                    {hoveredItem === item.href && !isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 opacity-10 rounded-xl`}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative z-30 flex items-center w-full">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      isActive 
                        ? `bg-purple-800 shadow-lg` 
                        : 'bg-gray-700/50 group-hover:bg-gray-600/50'
                    } transition-all duration-300`}>
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                    </div>
                    <span className={`flex-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                      </motion.div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="relative z-20 p-4 border-t border-gray-700/50">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-500/30"
          >
            <div className="w-8 h-8 rounded-lg bg-red-900/30 flex items-center justify-center mr-3 group-hover:bg-red-500/20 transition-colors">
              <FiLogOut className="w-4 h-4" />
            </div>
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.nav>
    </>
  );
}