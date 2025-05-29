'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  FiBookOpen, 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp,
  FiEdit,
  FiEye,
  FiFileText,
  FiActivity,
  FiCalendar,
  FiTarget,
  FiPlusCircle,
  FiStar,
  FiArrowUpRight,
  FiChevronRight
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  is_published: boolean;
  categories: Array<{
    id: number;
    name: string;
  }>;
  pdfs: Array<{
    id: number;
    title: string;
  }>;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalPdfs: number;
  totalRevenue: number;
  thisMonthRevenue: number;
}

export default function InstrukturPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalPdfs: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
  });
  const [userData, setUserData] = useState({ name: '', id: '' });

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    const name = localStorage.getItem('name') || 'Instruktur';
    const userId = localStorage.getItem('user_id') || '';
    setUserData({ name, id: userId });
  };

  const fetchData = async () => {
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
        calculateStats(data.data);
      } else {
        toast.error('Gagal memuat data kursus');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Terjadi kesalahan saat memuat data');
    }
  };

  const calculateStats = (coursesData: Course[]) => {
    const published = coursesData.filter(course => course.is_published).length;
    const draft = coursesData.length - published;
    const totalPdfs = coursesData.reduce((sum, course) => sum + course.pdfs.length, 0);
    const totalRevenue = coursesData.reduce((sum, course) => sum + parseFloat(course.price), 0);
    
    setStats({
      totalCourses: coursesData.length,
      publishedCourses: published,
      draftCourses: draft,
      totalPdfs,
      totalRevenue,
      thisMonthRevenue: totalRevenue * 0.3,
    });
  };

  const statCards = [
    {
      title: 'Total Kursus',
      value: stats.totalCourses,
      icon: FiBookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      change: '+12%',
      changeColor: 'text-green-600',
    },
    {
      title: 'Kursus Published',
      value: stats.publishedCourses,
      icon: FiUsers,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-700',
      change: '+8%',
      changeColor: 'text-green-600',
    },
    {
      title: 'Total Materi PDF',
      value: stats.totalPdfs,
      icon: FiFileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      change: '+24%',
      changeColor: 'text-green-600',
    },
    {
      title: 'Estimasi Pendapatan',
      value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`,
      icon: FiDollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-700',
      change: '+18%',
      changeColor: 'text-green-600',
    },
  ];

  const quickActions = [
    {
      title: 'Buat Kursus Baru',
      description: 'Mulai membuat kursus baru dengan materi PDF',
      icon: FiPlusCircle,
      href: '/instruktur/course/add',
      color: 'from-indigo-500 to-purple-600',
      hoverColor: 'hover:from-indigo-600 hover:to-purple-700',
    },
    {
      title: 'Kelola Kursus',
      description: 'Lihat dan edit kursus yang sudah ada',
      icon: FiEdit,
      href: '/instruktur/course',
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'hover:from-emerald-600 hover:to-teal-700',
    },
    {
      title: 'Statistik Kursus',
      description: 'Lihat performa dan analisis kursus',
      icon: FiActivity,
      href: '/instruktur/analytics',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700',
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-auto pt-20 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Header */}
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
                    Selamat Datang, {userData.name}!
                  </h1>
                  <p className="text-slate-600 text-sm lg:text-base">
                    Kelola kursus dan materi pembelajaran Anda dengan mudah
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Hari ini</p>
                  <p className="font-semibold text-gray-800">
                    {new Date().toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <FiCalendar className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${stat.changeColor}`}>
                    <FiTrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiTarget className="w-5 h-5 mr-2 text-emerald-600" />
              Aksi Cepat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group"
                >
                  <Link href={action.href}>
                    <div className={`bg-gradient-to-r ${action.color} ${action.hoverColor} p-6 rounded-2xl text-white shadow-lg transition-all duration-300 transform group-hover:shadow-2xl`}>
                      <div className="flex items-center justify-between mb-4">
                        <action.icon className="w-8 h-8" />
                        <FiArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                      <p className="text-white/90 text-sm">{action.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-emerald-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiBookOpen className="w-5 h-5 text-emerald-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">Kursus Terbaru</h2>
                </div>
                <Link href="/instruktur/course" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center transition-colors">
                  Lihat Semua
                  <FiChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="p-6">
              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBookOpen className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Belum Ada Kursus
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Mulai perjalanan mengajar Anda dengan membuat kursus pertama
                  </p>
                  <Link
                    href="/instruktur/course/add"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-all duration-300 shadow-lg"
                  >
                    <FiPlusCircle className="w-4 h-4" />
                    Buat Kursus Pertama
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.slice(0, 6).map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      {course.thumbnail && (
                        <div className="relative overflow-hidden">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${course.thumbnail.replace('thumbnails/', 'thumbnails/')}`}
                            alt={course.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
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
                        </div>
                      )}

                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {course.description || 'Tidak ada deskripsi'}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {course.categories.slice(0, 2).map((category) => (
                            <span
                              key={category.id}
                              className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                            >
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
                          <span className="text-lg font-bold text-emerald-600">
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
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                            Detail
                          </Link>
                          <Link
                            href={`/instruktur/course/${course.id}/edit`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors"
                          >
                            <FiEdit className="w-4 h-4" />
                            Edit
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Performance Summary */}
          {courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6"
            >
              <div className="flex items-center mb-4">
                <FiStar className="w-5 h-5 text-yellow-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Ringkasan Performa</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {((stats.publishedCourses / stats.totalCourses) * 100 || 0).toFixed(0)}%
                  </div>
                  <p className="text-gray-600">Kursus Terpublikasi</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {(stats.totalPdfs / stats.totalCourses || 0).toFixed(1)}
                  </div>
                  <p className="text-gray-600">Rata-rata PDF per Kursus</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stats.totalCourses > 0 ? 'Aktif' : 'Mulai'}
                  </div>
                  <p className="text-gray-600">Status Instruktur</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}