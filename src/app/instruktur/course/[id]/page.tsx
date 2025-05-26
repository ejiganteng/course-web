'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiEdit, FiPlus, FiDownload, FiTrash2, FiEye, FiFile } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import components to avoid SSR issues
const PdfViewer = dynamic(() => import('@/components/instruktur/course/PDFViewer'), { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <span className="ml-3 text-gray-600">Memuat PDF Viewer...</span>
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
  const [loading, setLoading] = useState(true);
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
        console.log('Course data loaded:', data.data);
        console.log('PDFs found:', data.data.pdfs?.length || 0);
      } else {
        toast.error('Gagal memuat detail kursus');
        router.push('/instruktur/course');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Terjadi kesalahan saat memuat data');
      router.push('/instruktur/course');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 ml-64 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-gray-600">Memuat detail kursus...</span>
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
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Kursus tidak ditemukan
            </h2>
            <Link
              href="/instruktur/course"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
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
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/instruktur/course"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Kembali
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
                <p className="text-gray-600">Detail kursus dan manajemen PDF</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddPdf}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Tambah PDF
              </button>
              <Link
                href={`/instruktur/course/${courseId}/edit`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiEdit className="w-4 h-4" />
                Edit Kursus
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {course.thumbnail && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${course.thumbnail.replace('thumbnails/', 'thumbnails/')}`}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      console.error('Thumbnail load error for course:', course.id);
                      console.error('Attempted URL:', (e.target as HTMLImageElement).src);
                      console.error('Original thumbnail path:', course.thumbnail);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                
                <div className="mb-4">
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

                <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description || 'Tidak ada deskripsi'}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>

                <div className="text-2xl font-bold text-indigo-600 mb-4">
                  Rp {parseInt(course.price).toLocaleString('id-ID')}
                </div>

                <div className="text-sm text-gray-500">
                  <p>Dibuat: {new Date(course.created_at).toLocaleDateString('id-ID')}</p>
                  <p>Diupdate: {new Date(course.updated_at).toLocaleDateString('id-ID')}</p>
                  <p>Total PDF: {course.pdfs.length}</p>
                </div>
              </div>

              {/* PDF List */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Materi PDF</h3>
                
                {course.pdfs.length === 0 ? (
                  <div className="text-center py-8">
                    <FiFile className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Belum ada materi PDF</p>
                    <button
                      onClick={handleAddPdf}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Tambah PDF Pertama
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {course.pdfs
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((pdf) => (
                        <div
                          key={pdf.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPdfId === pdf.id
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPdfId(pdf.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FiFile className="w-4 h-4 text-red-500" />
                              <div>
                                <p className="font-medium text-gray-800 text-sm">{pdf.title}</p>
                                <p className="text-xs text-gray-500">Urutan: {pdf.order_index}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPdfId(pdf.id);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Lihat"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPdf(pdf);
                                }}
                                className="p-1 text-orange-600 hover:text-orange-800"
                                title="Edit"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadPdf(pdf.id, pdf.title);
                                }}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Download"
                              >
                                <FiDownload className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePdf(pdf.id);
                                }}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Hapus"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                {selectedPdf ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{selectedPdf.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPdf(selectedPdf)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(selectedPdf.id, selectedPdf.title)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                        >
                          <FiDownload className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                    
                    {/* Updated PdfViewer usage - menggunakan pdfId */}
                    <PdfViewer
                      pdfId={selectedPdf.id}
                      title={selectedPdf.title}
                      showEditButton={true}
                      onEdit={() => handleEditPdf(selectedPdf)}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiFile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Pilih PDF untuk ditampilkan
                    </h3>
                    <p className="text-gray-500">
                      Klik pada salah satu PDF di sebelah kiri untuk melihat isinya
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* PDF Manager Modal */}
        {showPdfManager && (
          <PdfManager
            courseId={parseInt(courseId)}
            onClose={handleClosePdfManager}
            onSuccess={handlePdfManagerSuccess}
            editPdf={editingPdf}
          />
        )}
      </div>
    </div>
  );
}