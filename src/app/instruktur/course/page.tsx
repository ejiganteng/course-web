'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  DocumentIcon 
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { protectedFetch } from '@/utils/auth-utils';

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
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
}

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await protectedFetch('/courses/owner');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.data);
      } else {
        toast.error('Gagal mengambil data course');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      const response = await protectedFetch(`/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Course berhasil dihapus');
        fetchCourses();
        setShowDeleteModal(false);
        setSelectedCourse(null);
      } else {
        toast.error('Gagal menghapus course');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus course');
    }
  };

  const togglePublishStatus = async (course: Course) => {
    try {
      const formData = new FormData();
      formData.append('title', course.title);
      formData.append('description', course.description);
      formData.append('price', course.price);
      formData.append('is_published', (!course.is_published) ? '1' : '0');

      // Tambahkan category_ids jika ada
      if (course.categories && course.categories.length > 0) {
        course.categories.forEach(category => {
          formData.append('category_ids[]', category.id.toString());
        });
      }

      console.log('Toggling publish status for course:', course.id, 'to:', !course.is_published);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${course.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log('Toggle publish response status:', response.status);
      console.log('Toggle publish response:', responseText);

      if (response.ok) {
        toast.success(`Course berhasil ${course.is_published ? 'di-unpublish' : 'dipublish'}`);
        fetchCourses();
      } else {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.log('Toggle publish error:', errorData);
        } catch {
          errorData = { message: 'Gagal mengubah status publish' };
        }
        
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors).map(([field, messages]) => {
            return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          });
          toast.error(`Validasi gagal: ${errorMessages.join(', ')}`);
        } else {
          toast.error(errorData.message || 'Gagal mengubah status publish');
        }
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Terjadi kesalahan saat mengubah status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manajemen Course</h1>
              <p className="text-gray-600">Kelola course dan materi pembelajaran Anda</p>
            </div>
            <Link href="/instruktur/course/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
              >
                <PlusIcon className="w-5 h-5" />
                Tambah Course
              </motion.button>
            </Link>
          </div>

          {/* Course Grid */}
          {courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Belum Ada Course
              </h3>
              <p className="text-gray-500 mb-6">
                Mulai membuat course pertama Anda untuk berbagi pengetahuan
              </p>
              <Link href="/instruktur/course/create">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold">
                  Buat Course Pertama
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Course Thumbnail */}
                  <div className="h-48 bg-gray-200 relative">
                    {course.thumbnail ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${course.thumbnail}`}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <DocumentIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        course.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        Rp {Number(course.price).toLocaleString('id-ID')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {course.pdfs.length} materi
                      </span>
                    </div>

                    {/* Categories */}
                    {course.categories.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {course.categories.slice(0, 2).map((category) => (
                            <span
                              key={category.id}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                            >
                              {category.name}
                            </span>
                          ))}
                          {course.categories.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                              +{course.categories.length - 2} lainnya
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/instruktur/course/${course.id}`} className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                          <EyeIcon className="w-4 h-4" />
                          Detail
                        </button>
                      </Link>
                      
                      <Link href={`/instruktur/course/${course.id}/edit`} className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </button>
                      </Link>
                      
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowDeleteModal(true);
                        }}
                        className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Publish Toggle */}
                    <button
                      onClick={() => togglePublishStatus(course)}
                      className={`w-full mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        course.is_published
                          ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
                          : 'bg-green-50 hover:bg-green-100 text-green-700'
                      }`}
                    >
                      {course.is_published ? 'Unpublish Course' : 'Publish Course'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Konfirmasi Hapus Course
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus course "{selectedCourse.title}"? 
                Tindakan ini tidak dapat dibatalkan dan akan menghapus semua materi PDF yang terkait.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCourse(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteCourse(selectedCourse.id)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}