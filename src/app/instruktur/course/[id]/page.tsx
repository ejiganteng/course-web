'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  DocumentIcon,
  EyeIcon,
  ArrowDownCircleIcon 
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { protectedFetch } from '@/utils/auth-utils';
import Link from 'next/link';
import PDFViewer from '@/components/instruktur/course/PDFViewer';

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

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      const response = await protectedFetch(`/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.data);
      } else {
        toast.error('Gagal mengambil detail course');
        router.push('/instruktur/course');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengambil detail course');
      router.push('/instruktur/course');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (pdfId: number, title: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/${pdfId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('PDF berhasil didownload');
      } else {
        toast.error('Gagal mendownload PDF');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mendownload PDF');
    }
  };

  const handleViewPDF = (pdf: any) => {
    setSelectedPDF(pdf);
    setShowPDFViewer(true);
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

  if (!course) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 ml-64 p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">Course tidak ditemukan</h2>
            <Link href="/instruktur/course">
              <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg">
                Kembali ke Daftar Course
              </button>
            </Link>
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
          className="max-w-6xl"
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/instruktur/course">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Kembali
                </motion.button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
                <p className="text-gray-600">Detail course dan materi pembelajaran</p>
              </div>
            </div>
            <Link href={`/instruktur/course/${courseId}/edit`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                <PencilIcon className="w-5 h-5" />
                Edit Course
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Course</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Judul</label>
                    <p className="text-gray-800 font-medium">{course.title}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Harga</label>
                    <p className="text-2xl font-bold text-purple-600">
                      Rp {Number(course.price).toLocaleString('id-ID')}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Deskripsi</label>
                    <p className="text-gray-800 leading-relaxed">{course.description}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      course.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Jumlah Materi</label>
                    <p className="text-gray-800 font-medium">{course.pdfs.length} PDF</p>
                  </div>
                </div>

                {/* Categories */}
                {course.categories.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-500 mb-2">Kategori</label>
                    <div className="flex flex-wrap gap-2">
                      {course.categories.map((category) => (
                        <span
                          key={category.id}
                          className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PDF Materials */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Materi PDF ({course.pdfs.length})
                </h2>
                
                {course.pdfs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p>Belum ada materi PDF untuk course ini</p>
                    <Link href={`/instruktur/course/${courseId}/edit`}>
                      <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                        Tambah Materi
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {course.pdfs
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((pdf, index) => (
                      <motion.div
                        key={pdf.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <DocumentIcon className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{pdf.title}</h3>
                            <p className="text-sm text-gray-500">Urutan: {pdf.order_index}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewPDF(pdf)}
                            className="flex items-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                            Lihat
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownloadPDF(pdf.id, pdf.title)}
                            className="flex items-center gap-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            <ArrowDownCircleIcon className="w-4 h-4" />
                            Download
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Thumbnail and Stats */}
            <div className="space-y-6">
              {/* Thumbnail */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thumbnail</h3>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
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
                </div>
              </div>

              {/* Course Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistik</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dibuat</span>
                    <span className="text-gray-800 font-medium">
                      {new Date(course.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diperbarui</span>
                    <span className="text-gray-800 font-medium">
                      {new Date(course.updated_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Materi</span>
                    <span className="text-gray-800 font-medium">{course.pdfs.length} PDF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kategori</span>
                    <span className="text-gray-800 font-medium">{course.categories.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PDF Viewer Modal */}
        {showPDFViewer && selectedPDF && (
          <PDFViewer
            pdf={selectedPDF}
            isOpen={showPDFViewer}
            onClose={() => {
              setShowPDFViewer(false);
              setSelectedPDF(null);
            }}
          />
        )}
      </div>
    </div>
  );
}