'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiPlus, 
  FiDownload, 
  FiTrash2, 
  FiEye, 
  FiFile,
  FiBookOpen,
  FiDollarSign,
  FiCalendar,
  FiTag,
  FiFileText,
  FiClock,
  FiUser
} from 'react-icons/fi';
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/instruktur/course/PDFViewer'), { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      <span className="ml-3 text-emerald-700">Memuat PDF Viewer...</span>
    </div>
  )
});

const PdfManager = dynamic(() => import('@/components/instruktur/course/PDFManager'), { 
  ssr: false,
  loading: () => null
});

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
    created_at: string;
    updated_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedPdfId, setSelectedPdfId] = useState<number | null>(null);
  const [showPdfManager, setShowPdfManager] = useState(false);
  const [editingPdf, setEditingPdf] = useState<{
    id: number;
    title: string;
    order_index: number;
  } | null>(null);

  useEffect(() => {
    fetchCourseDetail();
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourse(data.data);
      } else {
        toast.error('Gagal memuat detail kursus');
        router.push('/instruktur/course');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Terjadi kesalahan saat memuat data');
      router.push('/instruktur/course');
    } 
  };

  const handleDeletePdf = async (pdfId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus PDF ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/${pdfId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('PDF berhasil dihapus');
        fetchCourseDetail();
        if (selectedPdfId === pdfId) {
          setSelectedPdfId(null);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Gagal menghapus PDF');
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);
      toast.error('Terjadi kesalahan saat menghapus PDF');
    }
  };

  const handleDownloadPdf = async (pdfId: number, title: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/${pdfId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('PDF berhasil didownload');
      } else {
        toast.error('Gagal download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Terjadi kesalahan saat download PDF');
    }
  };

  const handleEditPdf = (pdf: any) => {
    setEditingPdf({
      id: pdf.id,
      title: pdf.title,
      order_index: pdf.order_index
    });
    setShowPdfManager(true);
  };

  const handleAddPdf = () => {
    setEditingPdf(null);
    setShowPdfManager(true);
  };

  const handleClosePdfManager = () => {
    setShowPdfManager(false);
    setEditingPdf(null);
  };

  const handlePdfManagerSuccess = () => {
    setShowPdfManager(false);
    setEditingPdf(null);
    fetchCourseDetail();
  };

  if (!course) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-auto pt-20 lg:pt-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBookOpen className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Kursus tidak ditemukan
            </h2>
            <Link
              href="/instruktur/course"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
            >
              Kembali ke Daftar Kursus
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedPdf = course.pdfs.find(pdf => pdf.id === selectedPdfId);

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
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <Link
                  href="/instruktur/course"
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Kembali
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FiBookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 line-clamp-1">
                      {course.title}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      Detail kursus dan manajemen PDF
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleAddPdf}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg text-sm"
                >
                  <FiPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah PDF</span>
                </button>
                <Link
                  href={`/instruktur/course/${courseId}/edit`}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg text-sm"
                >
                  <FiEdit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Kursus</span>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-1 space-y-6"
            >
              {/* Course Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                {course.thumbnail && (
                  <div className="relative">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${course.thumbnail.replace('thumbnails/', 'thumbnails/')}`}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">{course.title}</h2>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {course.description || 'Tidak ada deskripsi'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.categories.map((category) => (
                      <span
                        key={category.id}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full flex items-center gap-1"
                      >
                        <FiTag className="w-3 h-3" />
                        {category.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <FiDollarSign className="w-5 h-5 text-emerald-600" />
                    <span className="text-2xl font-bold text-emerald-600">
                      Rp {parseInt(course.price).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      <span>Instruktur: {course.instructor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>Dibuat: {new Date(course.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      <span>Diupdate: {new Date(course.updated_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiFileText className="w-4 h-4" />
                      <span>Total PDF: {course.pdfs.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF List */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FiFileText className="w-5 h-5 text-emerald-600" />
                    Materi PDF
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {course.pdfs.length} file
                  </span>
                </div>
                
                {course.pdfs.length === 0 ? (
                  <div className="text-center py-8">
                    <FiFile className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Belum ada materi PDF</p>
                    <button
                      onClick={handleAddPdf}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 mx-auto transition-all duration-300 shadow-lg text-sm"
                    >
                      <FiPlus className="w-4 h-4" />
                      Tambah PDF Pertama
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    <AnimatePresence>
                      {course.pdfs
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((pdf, index) => (
                          <motion.div
                            key={pdf.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 group ${
                              selectedPdfId === pdf.id
                                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                            }`}
                            onClick={() => setSelectedPdfId(pdf.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                  <FiFile className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-800 text-sm truncate group-hover:text-emerald-700">
                                    {pdf.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Urutan: {pdf.order_index}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPdfId(pdf.id);
                                  }}
                                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                  title="Lihat"
                                >
                                  <FiEye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditPdf(pdf);
                                  }}
                                  className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadPdf(pdf.id, pdf.title);
                                  }}
                                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                                  title="Download"
                                >
                                  <FiDownload className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePdf(pdf.id);
                                  }}
                                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                                  title="Hapus"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>

            {/* PDF Viewer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-2"
            >
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 h-full">
                {selectedPdf ? (
                  <div className="h-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FiFile className="w-5 h-5 text-emerald-600" />
                        {selectedPdf.title}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPdf(selectedPdf)}
                          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-all duration-300 shadow-lg"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(selectedPdf.id, selectedPdf.title)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-all duration-300 shadow-lg"
                        >
                          <FiDownload className="w-4 h-4" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="h-full pb-6">
                      <PdfViewer
                        pdfId={selectedPdf.id}
                        title={selectedPdf.title}
                        showEditButton={true}
                        onEdit={() => handleEditPdf(selectedPdf)}
                        className="h-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiFile className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-3">
                      Pilih PDF untuk ditampilkan
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Klik pada salah satu PDF di sebelah kiri untuk melihat isinya
                    </p>
                    {course.pdfs.length === 0 && (
                      <button
                        onClick={handleAddPdf}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-300 shadow-lg"
                      >
                        <FiPlus className="w-4 h-4" />
                        Tambah PDF Pertama
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* PDF Manager Modal */}
        <AnimatePresence>
          {showPdfManager && (
            <PdfManager
              courseId={parseInt(courseId)}
              onClose={handleClosePdfManager}
              onSuccess={handlePdfManagerSuccess}
              editPdf={editingPdf}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}