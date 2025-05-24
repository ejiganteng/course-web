'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  TrashIcon, 
  EyeIcon,
  PencilIcon,
  DocumentIcon 
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { protectedFetch } from '@/utils/auth-utils';
import Link from 'next/link';
import PDFViewer from '@/components/instruktur/course/PDFViewer';

interface Category {
  id: number;
  name: string;
}

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
    file_path: string;
    order_index: number;
  }>;
}

interface PDFFile {
  id: string;
  title: string;
  file: File | null;
  order_index: number;
  isExisting?: boolean;
  existingId?: number;
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: null as File | null,
    is_published: false,
    category_ids: [] as number[],
  });
  const [newPdfFiles, setNewPdfFiles] = useState<PDFFile[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [editingPDF, setEditingPDF] = useState<number | null>(null);
  const [editPDFData, setEditPDFData] = useState({
    title: '',
    order_index: 0,
    file: null as File | null
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
      fetchCategories();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      const response = await protectedFetch(`/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        const courseData = data.data;
        setCourse(courseData);
        setFormData({
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          thumbnail: null,
          is_published: courseData.is_published,
          category_ids: courseData.categories.map((cat: any) => cat.id),
        });
      } else {
        toast.error('Gagal mengambil detail course');
        router.push('/instruktur/course');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengambil detail course');
      router.push('/instruktur/course');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await protectedFetch('/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      }
    } catch (error) {
      toast.error('Gagal mengambil data kategori');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }));
  };

  const addNewPDFFile = () => {
    const newPDF: PDFFile = {
      id: Date.now().toString(),
      title: '',
      file: null,
      order_index: (course?.pdfs.length || 0) + newPdfFiles.length + 1,
      isExisting: false
    };
    setNewPdfFiles(prev => [...prev, newPDF]);
  };

  const removeNewPDFFile = (id: string) => {
    setNewPdfFiles(prev => prev.filter(pdf => pdf.id !== id));
  };

  const updateNewPDFFile = (id: string, field: string, value: any) => {
    setNewPdfFiles(prev => prev.map(pdf => 
      pdf.id === id ? { ...pdf, [field]: value } : pdf
    ));
  };

  const handleDeleteExistingPDF = async (pdfId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus PDF ini?')) return;

    try {
      const response = await protectedFetch(`/pdfs/${pdfId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('PDF berhasil dihapus');
        fetchCourseDetail(); // Refresh data
      } else {
        toast.error('Gagal menghapus PDF');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus PDF');
    }
  };

  const handleEditPDF = (pdf: any) => {
    setEditingPDF(pdf.id);
    setEditPDFData({
      title: pdf.title,
      order_index: pdf.order_index,
      file: null
    });
  };

  const handleSaveEditPDF = async () => {
    if (!editingPDF) return;

    try {
      const formData = new FormData();
      formData.append('pdfs[0][title]', editPDFData.title);
      formData.append('pdfs[0][order_index]', editPDFData.order_index.toString());
      
      if (editPDFData.file) {
        formData.append('pdfs[0][file]', editPDFData.file);
      }

      console.log('Updating PDF with data:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/${editingPDF}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log('PDF update response status:', response.status);
      console.log('PDF update response:', responseText);

      if (response.ok) {
        toast.success('PDF berhasil diperbarui');
        setEditingPDF(null);
        setEditPDFData({ title: '', order_index: 0, file: null });
        fetchCourseDetail(); // Refresh data
      } else {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.log('PDF update error:', errorData);
        } catch {
          errorData = { message: 'Gagal memperbarui PDF' };
        }
        
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors).map(([field, messages]) => {
            return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          });
          toast.error(`Validasi gagal: ${errorMessages.join(', ')}`);
        } else {
          toast.error(errorData.message || 'Gagal memperbarui PDF');
        }
      }
    } catch (error) {
      console.error('Error updating PDF:', error);
      toast.error('Terjadi kesalahan saat memperbarui PDF');
    }
  };

  const handleViewPDF = (pdf: any) => {
    setSelectedPDF(pdf);
    setShowPDFViewer(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setLoading(true);

    try {
      // Update course menggunakan FormData dengan method PUT
      const courseFormData = new FormData();
      courseFormData.append('title', formData.title);
      courseFormData.append('description', formData.description);
      courseFormData.append('price', formData.price);
      courseFormData.append('is_published', formData.is_published ? '1' : '0');
      
      // Hanya tambahkan thumbnail jika ada file baru
      if (formData.thumbnail) {
        courseFormData.append('thumbnail', formData.thumbnail);
      }
      
      // Category IDs - sesuai dengan backend expectation
      if (formData.category_ids.length > 0) {
        formData.category_ids.forEach(id => {
          courseFormData.append('category_ids[]', id.toString());
        });
      }

      console.log('Updating course with data:');
      for (let [key, value] of courseFormData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const courseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          // Tidak menambahkan Content-Type, biarkan browser yang handle untuk FormData
        },
        body: courseFormData,
      });

      const responseText = await courseResponse.text();
      console.log('Course update response status:', courseResponse.status);
      console.log('Course update response:', responseText);

      if (!courseResponse.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.log('Error data:', errorData);
        } catch {
          errorData = { message: 'Gagal memperbarui course' };
        }
        
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors).map(([field, messages]) => {
            return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          });
          throw new Error(`Validasi gagal:\n${errorMessages.join('\n')}`);
        }
        
        throw new Error(errorData.message || 'Gagal memperbarui course');
      }

      // Upload new PDFs if any
      if (newPdfFiles.length > 0) {
        const validPDFs = newPdfFiles.filter(pdf => pdf.title && pdf.file);
        
        if (validPDFs.length > 0) {
          const pdfFormData = new FormData();
          
          validPDFs.forEach((pdf, index) => {
            pdfFormData.append(`pdfs[${index}][title]`, pdf.title);
            pdfFormData.append(`pdfs[${index}][file]`, pdf.file!);
            pdfFormData.append(`pdfs[${index}][order_index]`, pdf.order_index.toString());
          });

          console.log('Uploading PDFs:', validPDFs.length);

          const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json',
            },
            body: pdfFormData,
          });

          if (!pdfResponse.ok) {
            console.warn('PDF upload failed:', await pdfResponse.text());
            toast.warning('Course berhasil diperbarui, tetapi ada masalah saat mengupload PDF baru');
          } else {
            console.log('PDFs uploaded successfully');
          }
        }
      }

      toast.success('Course berhasil diperbarui');
      router.push('/instruktur/course');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui course');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
          <div className="mb-8 flex items-center gap-4">
            <Link href={`/instruktur/course/${courseId}`}>
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
              <h1 className="text-3xl font-bold text-gray-800">Edit Course</h1>
              <p className="text-gray-600">Perbarui informasi course dan kelola materi PDF</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Informasi Course</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Course *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga (Rupiah) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        required
                      />
                    </div>

                    {/* Thumbnail */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail Baru (Opsional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah thumbnail</p>
                    </div>

                    {/* Categories */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {categories.map((category) => (
                          <label key={category.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.category_ids.includes(category.id)}
                              onChange={() => handleCategoryChange(category.id)}
                              className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Published Status */}
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_published"
                          checked={formData.is_published}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Publish course
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Link href={`/instruktur/course/${courseId}`}>
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                      Batal
                    </button>
                  </Link>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    } text-white`}
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </motion.button>
                </div>
              </form>
            </div>

            {/* PDF Management Sidebar */}
            <div className="space-y-6">
              {/* Current Thumbnail */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thumbnail Saat Ini</h3>
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

              {/* Existing PDFs */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Materi PDF Saat Ini ({course.pdfs.length})
                </h3>
                
                {course.pdfs.length === 0 ? (
                  <p className="text-gray-500 text-sm">Belum ada materi PDF</p>
                ) : (
                  <div className="space-y-3">
                    {course.pdfs
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((pdf) => (
                      <div key={pdf.id} className="border border-gray-200 rounded-lg p-3">
                        {editingPDF === pdf.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editPDFData.title}
                              onChange={(e) => setEditPDFData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              placeholder="Judul PDF"
                            />
                            <input
                              type="number"
                              value={editPDFData.order_index}
                              onChange={(e) => setEditPDFData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              placeholder="Urutan"
                              min="1"
                            />
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                setEditPDFData(prev => ({ ...prev, file: file || null }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveEditPDF}
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() => setEditingPDF(null)}
                                className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800 text-sm">{pdf.title}</h4>
                              <span className="text-xs text-gray-500">#{pdf.order_index}</span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleViewPDF(pdf)}
                                className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100"
                              >
                                Lihat
                              </button>
                              <button
                                onClick={() => handleEditPDF(pdf)}
                                className="flex-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs hover:bg-green-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteExistingPDF(pdf.id)}
                                className="flex-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs hover:bg-red-100"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New PDFs */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Tambah PDF Baru</h3>
                  <motion.button
                    type="button"
                    onClick={addNewPDFFile}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Tambah
                  </motion.button>
                </div>

                {newPdfFiles.length === 0 ? (
                  <p className="text-gray-500 text-sm">Belum ada PDF baru yang akan ditambahkan</p>
                ) : (
                  <div className="space-y-3">
                    {newPdfFiles.map((pdf) => (
                      <div key={pdf.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={pdf.title}
                            onChange={(e) => updateNewPDFFile(pdf.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Judul PDF"
                          />
                          <input
                            type="number"
                            value={pdf.order_index}
                            onChange={(e) => updateNewPDFFile(pdf.id, 'order_index', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Urutan"
                            min="1"
                          />
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              updateNewPDFFile(pdf.id, 'file', file);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewPDFFile(pdf.id)}
                            className="w-full px-3 py-2 bg-red-50 text-red-700 rounded-md text-sm hover:bg-red-100"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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