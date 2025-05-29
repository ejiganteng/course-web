'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiPlus, 
  FiTrash2, 
  FiUpload, 
  FiFile, 
  FiEye,
  FiBookOpen,
  FiDollarSign,
  FiFileText,
  FiTag,
  FiImage,
  FiSave
} from 'react-icons/fi';

interface Category {
  id: number;
  name: string;
}

interface PdfFile {
  id: string;
  title: string;
  file: File | null;
  order_index: number;
}

export default function AddCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    is_published: false,
    category_ids: [] as number[],
  });
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error('Thumbnail harus berupa file JPG, JPEG, atau PNG');
        return;
      }
      
      if (file.size > 10240 * 1024) {
        toast.error('Ukuran thumbnail maksimal 10MB');
        return;
      }

      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addPdfFile = () => {
    const newPdf: PdfFile = {
      id: Date.now().toString(),
      title: '',
      file: null,
      order_index: pdfFiles.length + 1,
    };
    setPdfFiles(prev => [...prev, newPdf]);
  };

  const removePdfFile = (id: string) => {
    setPdfFiles(prev => {
      const filtered = prev.filter(pdf => pdf.id !== id);
      return filtered.map((pdf, index) => ({
        ...pdf,
        order_index: index + 1
      }));
    });
  };

  const updatePdfFile = (id: string, field: keyof PdfFile, value: any) => {
    setPdfFiles(prev => prev.map(pdf => 
      pdf.id === id ? { ...pdf, [field]: value } : pdf
    ));
  };

  const handlePdfFileChange = (id: string, file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('File harus berupa PDF');
      return;
    }
    
    if (file.size > 10240 * 1024) {
      toast.error('Ukuran file PDF maksimal 10MB');
      return;
    }

    updatePdfFile(id, 'file', file);
  };

  const previewPdf = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Judul kursus wajib diisi');
      return false;
    }
    
    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error('Harga wajib diisi dan tidak boleh negatif');
      return false;
    }
    
    if (!thumbnail) {
      toast.error('Thumbnail wajib diunggah');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const courseFormData = new FormData();
      courseFormData.append('title', formData.title.trim());
      courseFormData.append('description', formData.description.trim());
      courseFormData.append('price', formData.price);
      courseFormData.append('is_published', formData.is_published ? '1' : '0');
      courseFormData.append('thumbnail', thumbnail!);
      
      formData.category_ids.forEach(id => {
        courseFormData.append('category_ids[]', id.toString());
      });

      const token = localStorage.getItem('token');
      const courseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: courseFormData,
      });

      if (!courseResponse.ok) {
        const errorData = await courseResponse.json();
        
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach(key => {
            errorData.errors[key].forEach((error: string) => {
              toast.error(`${key}: ${error}`);
            });
          });
        } else {
          toast.error(errorData.message || 'Gagal membuat kursus');
        }
        return;
      }

      const courseData = await courseResponse.json();
      const courseId = courseData.data.id;

      // Upload PDFs if any
      if (pdfFiles.length > 0) {
        const validPdfs = pdfFiles.filter(pdf => pdf.file && pdf.title.trim());
        
        if (validPdfs.length > 0) {
          const pdfFormData = new FormData();
          
          validPdfs.forEach((pdf, index) => {
            pdfFormData.append(`pdfs[${index}][title]`, pdf.title.trim());
            pdfFormData.append(`pdfs[${index}][file]`, pdf.file!);
            pdfFormData.append(`pdfs[${index}][order_index]`, pdf.order_index.toString());
          });

          const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: pdfFormData,
          });

          if (!pdfResponse.ok) {
            toast.warning('Kursus berhasil dibuat, tapi ada masalah dengan upload PDF');
          } else {
            toast.success('Kursus dan PDF berhasil dibuat');
          }
        } else {
          toast.success('Kursus berhasil dibuat');
        }
      } else {
        toast.success('Kursus berhasil dibuat');
      }

      router.push('/instruktur/course');
      
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
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
              className="flex items-center gap-4"
            >
              <Link
                href="/instruktur/course"
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg"
              >
                <FiArrowLeft className="w-4 h-4" />
                Kembali
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Tambah Kursus Baru
                  </h1>
                  <p className="text-slate-600 text-sm lg:text-base">
                    Buat kursus baru dengan materi PDF
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-emerald-50/50">
              <div className="flex items-center gap-3">
                <FiBookOpen className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Informasi Kursus</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiBookOpen className="w-4 h-4 text-emerald-600" />
                    Judul Kursus *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    maxLength={255}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Masukkan judul kursus yang menarik"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiDollarSign className="w-4 h-4 text-emerald-600" />
                    Harga *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiFileText className="w-4 h-4 text-emerald-600" />
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                  placeholder="Jelaskan tentang kursus ini..."
                />
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiImage className="w-4 h-4 text-emerald-600" />
                  Thumbnail *
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-emerald-300 transition-colors">
                  {thumbnailPreview ? (
                    <div className="text-center">
                      <img 
                        src={thumbnailPreview} 
                        alt="Preview" 
                        className="mx-auto h-48 w-auto object-cover rounded-xl mb-4 shadow-lg"
                      />
                      <div className="flex justify-center gap-3">
                        <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Ganti Thumbnail
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleThumbnailChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnail(null);
                            setThumbnailPreview(null);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FiUpload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <label className="cursor-pointer">
                        <span className="block text-lg font-semibold text-gray-700 mb-2">
                          Upload Thumbnail
                        </span>
                        <span className="block text-sm text-gray-500 mb-4">
                          JPG, JPEG, PNG hingga 10MB
                        </span>
                        <span className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-colors inline-block">
                          Pilih File
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleThumbnailChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiTag className="w-4 h-4 text-emerald-600" />
                    Kategori
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center p-3 rounded-xl border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.category_ids.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Published Status */}
              <div className="flex items-center p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-3"
                />
                <div>
                  <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Publikasikan kursus
                  </label>
                  <p className="text-xs text-gray-500">
                    Kursus akan langsung dapat dilihat oleh peserta
                  </p>
                </div>
              </div>

              {/* PDF Files Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiFileText className="w-4 h-4 text-emerald-600" />
                    Materi PDF (Opsional)
                  </label>
                  <button
                    type="button"
                    onClick={addPdfFile}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-lg"
                  >
                    <FiPlus className="w-4 h-4" />
                    Tambah PDF
                  </button>
                </div>

                {pdfFiles.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <FiFile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Belum ada PDF yang ditambahkan
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Tambahkan materi PDF untuk melengkapi kursus Anda
                    </p>
                    <button
                      type="button"
                      onClick={addPdfFile}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-colors shadow-lg"
                    >
                      <FiPlus className="w-4 h-4" />
                      Tambah PDF Pertama
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {pdfFiles.map((pdf, index) => (
                        <motion.div 
                          key={pdf.id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="border border-gray-200 rounded-2xl p-6 bg-white/50 backdrop-blur-sm"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                              <FiFile className="w-5 h-5 text-emerald-600" />
                              PDF {index + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removePdfFile(pdf.id)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-sm font-medium text-gray-600">Judul PDF *</label>
                              <input
                                type="text"
                                value={pdf.title}
                                onChange={(e) => updatePdfFile(pdf.id, 'title', e.target.value)}
                                maxLength={255}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                                placeholder="Masukkan judul PDF"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-600">Urutan</label>
                              <input
                                type="number"
                                value={pdf.order_index}
                                onChange={(e) => updatePdfFile(pdf.id, 'order_index', parseInt(e.target.value) || 1)}
                                min="0"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600">File PDF *</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
                              {pdf.file ? (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <FiFile className="w-8 h-8 text-red-500" />
                                    <div>
                                      <p className="font-medium text-gray-800">{pdf.file.name}</p>
                                      <p className="text-sm text-gray-500">
                                        {(pdf.file.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => previewPdf(pdf.file!)}
                                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Preview PDF"
                                    >
                                      <FiEye className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updatePdfFile(pdf.id, 'file', null)}
                                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Hapus file"
                                    >
                                      <FiTrash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <label className="cursor-pointer block text-center">
                                  <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                  <span className="text-sm font-medium text-gray-700">Upload PDF</span>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handlePdfFileChange(pdf.id, file);
                                    }}
                                    className="hidden"
                                  />
                                  <p className="text-xs text-gray-500 mt-2">PDF hingga 10MB</p>
                                </label>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <Link
                  href="/instruktur/course"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-center"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      Simpan Kursus
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}