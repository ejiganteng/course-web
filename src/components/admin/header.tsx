"use client"

import { motion } from 'framer-motion';
import { HiBell, HiChevronDown } from 'react-icons/hi2';

export default function AdminHeader() {
  return (
    <motion.header
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 left-64 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <HiBell className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span className="text-gray-700">Admin</span>
            <HiChevronDown className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>
    </motion.header>
  );
}