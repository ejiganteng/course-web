'use client';

import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import CourseList from '@/components/instruktur/course/CourseList';

export default function CoursePage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Kelola Course</h1>
              <p className="text-gray-600">Buat dan kelola course Anda</p>
            </div>
            <Link href="/instruktur/course/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow-lg hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Buat Course Baru
              </motion.button>
            </Link>
          </div>

          {/* Course List */}
          <CourseList />
        </motion.div>
      </div>
    </div>
  );
}