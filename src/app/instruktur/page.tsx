'use client';

import { motion } from 'framer-motion';

export default function InstrukturPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Instruktur</h1>
            <p className="text-gray-600">Selamat datang di panel instruktur</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Halaman Dashboard Instruktur
              </h2>
              <p className="text-gray-500">
                Halaman ini masih dalam pengembangan. Silahkan gunakan menu navigasi untuk mengakses fitur lainnya.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}