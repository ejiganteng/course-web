'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiFileText, 
  FiBookOpen,
  FiDollarSign,
  FiCalendar,
  FiTag,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'published' && course.is_published) ||
                         (filterStatus === 'draft' && !course.is_published);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.is_published).length,
    draft: courses.filter(c => !c.is_published).length,
    totalPdfs: courses.reduce((sum, c) => sum + c.pdfs.length, 0),
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-auto pt-20 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FiBookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Manajemen Kursus
                  </h1>
                  <p className="text-slate-600 text-sm lg:text-base">
                    Kelola kursus dan materi pembelajaran Anda
                  </p>
                </div>
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/instruktur/course/add"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 lg:px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all duration-300 text-sm w-full sm:w-auto"
                >
                  <FiPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah Kursus</span>
                  <span className="sm:hidden">Tambah</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[
              { title: 'Total Kursus', value: stats.total, icon: FiBookOpen, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
              { title: 'Published', value: stats.published, icon: FiTrendingUp, color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100' },
              { title: 'Draft', value: stats.draft, icon: FiEdit, color: 'from-yellow-500 to-yellow-600', bgColor: 'from-yellow-50 to-yellow-100' },
              { title: 'Total PDF', value: stats.totalPdfs, icon: FiFileText, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 lg:p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            {/* Filters */}
            <div className="p-4 lg:p-6 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-emerald-50/50">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Cari kursus..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:outline-none text-gray-700"
                  />
                </div>
                
                <div className="flex gap-2">
                  {[
                    { key: 'all', label: 'Semua', count: stats.total },
                    { key: 'published', label: 'Published', count: stats.published },
                    { key: 'draft', label: 'Draft', count: stats.draft },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setFilterStatus(filter.key as any)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus === filter.key
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 lg:p-6">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12 lg:py-16">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBookOpen className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {searchTerm || filterStatus !== 'all' ? 'Tidak ada kursus yang sesuai' : 'Belum Ada Kursus'}
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm lg:text-base">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Coba ubah kata kunci pencarian atau filter'
                      : 'Mulai perjalanan mengajar Anda dengan membuat kursus pertama'
                    }
                  </p>
                  {!searchTerm && filterStatus === 'all' && (
                    <Link
                      href="/instruktur/course/add"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-all duration-300 shadow-lg text-sm"
                    >
                      <FiPlus className="w-4 h-4" />
                      Buat Kursus Pertama
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                      >
                        <div className="relative overflow-hidden">
                          {course.thumbnail ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${course.thumbnail.replace('thumbnails/', 'thumbnails/')}`}
                              alt={course.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                              <FiBookOpen className="w-12 h-12 text-emerald-500" />
                            </div>
                          )}
                          
                          <div className="absolute top-3 right-3">
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
                          
                          <div className="absolute top-3 left-3">
                            <div className="flex items-center gap-1 text-white text-xs bg-black/50 px-2 py-1 rounded-full">
                              <FiCalendar className="w-3 h-3" />
                              {new Date(course.created_at).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {course.description || 'Tidak ada deskripsi'}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {course.categories.slice(0, 2).map((category) => (
                              <span
                                key={category.id}
                                className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full flex items-center gap-1"
                              >
                                <FiTag className="w-3 h-3" />
                                {category.name}
                              </span>
                            ))}
                            {course.categories.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{course.categories.length - 2} lagi
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-1 text-emerald-600 font-bold">
                              <FiDollarSign className="w-4 h-4" />
                              <span className="text-lg">
                                Rp {parseInt(course.price).toLocaleString('id-ID')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <FiFileText className="w-4 h-4" />
                              <span>{course.pdfs.length} PDF</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              href={`/instruktur/course/${course.id}`}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                            >
                              <FiEye className="w-4 h-4" />
                              Detail
                            </Link>
                            <Link
                              href={`/instruktur/course/${course.id}/edit`}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors"
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
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}