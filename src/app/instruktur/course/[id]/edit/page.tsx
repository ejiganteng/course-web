'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { protectedFetch } from '@/utils/auth-utils';
import CourseForm from '@/components/instruktur/course/CourseForm';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.id as string);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching course data for ID:', courseId);
      
      const response = await protectedFetch(`/courses/${courseId}`);
      
      console.log('Fetch course response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Course data received:', data);
        
        // Check if user is instructor of this course
        const course = data.data;
        const currentUserId = parseInt(localStorage.getItem('user_id') || '0');
        
        if (course.instructor.id !== currentUserId) {
          setError('Anda tidak memiliki izin untuk mengedit course ini');
          return;
        }
        
        setCourseData(course);
      } else if (response.status === 404) {
        setError('Course tidak ditemukan');
      } else if (response.status === 403) {
        setError('Anda tidak memiliki izin untuk mengakses course ini');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal memuat data course');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Gagal memuat data course. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId && !isNaN(courseId)) {
      fetchCourseData();
    } else {
      setError('ID course tidak valid');
      setLoading(false);
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 ml-64 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data course...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/instruktur/course">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Edit Course</h1>
                <p className="text-gray-600">Terjadi masalah saat memuat course</p>
              </div>
            </div>

            {/* Error Display */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center py-12">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {error}
                </h2>
                <p className="text-gray-500 mb-6">
                  {error.includes('tidak ditemukan') 
                    ? 'Course yang Anda cari mungkin telah dihapus atau ID tidak valid'
                    : error.includes('izin')
                    ? 'Hanya pembuat course yang dapat mengedit course ini'
                    : 'Silakan coba lagi atau hubungi administrator jika masalah berlanjut'
                  }
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => fetchCourseData()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Coba Lagi
                  </button>
                  <Link href="/instruktur/course">
                    <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Kembali ke Daftar Course
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/instruktur/course">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Course</h1>
              <p className="text-gray-600">Edit informasi course dan kelola materi PDF</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <CourseForm 
              mode="edit" 
              courseId={courseId}
              initialData={courseData}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}