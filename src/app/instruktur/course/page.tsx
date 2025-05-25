'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiFileText } from 'react-icons/fi';

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  is_published: boolean;
  instructor: {
    id: number;
    name: string;
    email: string;
  };
  categories: Array<{
    id: number;
    name: string;
  }>;
  pdfs: Array<{
    id: number;
    title: string;
    file_path: string;
    order_index: number;
  }>;
  created_at: string;
  updated_at: string;
}

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/owner`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data);
      } else {
        toast.error('Gagal memuat data kursus');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kursus ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Kursus berhasil dihapus');
        fetchCourses();
      } else {
        toast.error('Gagal menghapus kursus');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus kursus');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 ml-64 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          </div>
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Manajemen Kursus</h1>
              <p className="text-gray-600">Kelola kursus dan materi PDF Anda</p>
            </div>
            <Link
              href="/instruktur/course/add"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Tambah Kursus
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Belum Ada Kursus
                </h2>
                <p className="text-gray-500 mb-6">
                  Anda belum memiliki kursus. Mulai dengan membuat kursus pertama Anda.
                </p>
                <Link
                  href="/instruktur/course/add"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Buat Kursus Pertama
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    {course.thumbnail && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${course.thumbnail.replace('thumbnails/', 'thumbnails/')}`}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          console.error('Thumbnail load error for course:', course.id);
                          console.error('Attempted URL:', (e.target as HTMLImageElement).src);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          course.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {course.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {course.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {course.categories.map((category) => (
                        <span
                          key={category.id}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-indigo-600">
                        Rp {parseInt(course.price).toLocaleString('id-ID')}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FiFileText className="w-4 h-4" />
                        {course.pdfs.length} PDF
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/instruktur/course/${course.id}`}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                        Detail
                      </Link>
                      <Link
                        href={`/instruktur/course/${course.id}/edit`}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors"
                      >
                        <FiEdit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}