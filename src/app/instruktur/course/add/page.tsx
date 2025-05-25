'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiPlus, FiTrash2, FiUpload, FiFile, FiEye } from 'react-icons/fi';

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
  
  // Form state - sesuai dengan CourseStoreRequest
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
      // Validate file type - sesuai backend: jpg,jpeg,png
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error('Thumbnail harus berupa file JPG, JPEG, atau PNG');
        return;
      }
      
      // Validate file size (10MB = 10240KB)
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
      // Reorder indices
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
    // Validate file type - hanya PDF
    if (file.type !== 'application/pdf') {
      toast.error('File harus berupa PDF');
      return;
    }
    
    // Validate file size (10MB = 10240KB)
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
    // Sesuai CourseStoreRequest validation
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
      // Create course first - sesuai CourseStoreRequest
      const courseFormData = new FormData();
      courseFormData.append('title', formData.title.trim());
      courseFormData.append('description', formData.description.trim());
      courseFormData.append('price', formData.price);
      courseFormData.append('is_published', formData.is_published ? '1' : '0');
      courseFormData.append('thumbnail', thumbnail!);
      
      // Add category IDs - sesuai backend format
      formData.category_ids.forEach(id => {
        courseFormData.append('category_ids[]', id.toString());
      });

      console.log('Sending course data:');
      for (let [key, value] of courseFormData.entries()) {
        console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      }

      const token = localStorage.getItem('token');
      const courseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Jangan set Content-Type untuk FormData, browser akan set otomatis
        },
        body: courseFormData,
      });

      if (!courseResponse.ok) {
        const errorData = await courseResponse.json();
        console.error('Course creation error:', errorData);
        
        if (errorData.errors) {
          // Display validation errors
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

      // Upload PDFs if any - sesuai PdfRequest format
      if (pdfFiles.length > 0) {
        const validPdfs = pdfFiles.filter(pdf => pdf.file && pdf.title.trim());
        
        if (validPdfs.length > 0) {
          const pdfFormData = new FormData();
          
          validPdfs.forEach((pdf, index) => {
            pdfFormData.append(`pdfs[${index}][title]`, pdf.title.trim());
            pdfFormData.append(`pdfs[${index}][file]`, pdf.file!);
            pdfFormData.append(`pdfs[${index}][order_index]`, pdf.order_index.toString());
          });

          console.log('Sending PDF data:');
          for (let [key, value] of pdfFormData.entries()) {
            console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
          }

          const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: pdfFormData,
          });

          if (!pdfResponse.ok) {
            const pdfError = await pdfResponse.json();
            console.warn('PDF upload error:', pdfError);
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
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex items-center gap-4">
            <Link
              href="/instruktur/course"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Tambah Kursus Baru</h1>
              <p className="text-gray-600">Buat kursus baru dengan materi PDF</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Kursus *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    maxLength={255}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan judul kursus"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Deskripsi kursus..."
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {thumbnailPreview ? (
                    <div className="text-center">
                      <img 
                        src={thumbnailPreview} 
                        alt="Preview" 
                        className="mx-auto h-32 w-auto object-cover rounded-lg mb-4"
                      />
                      <div className="space-x-2">
                        <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
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
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Hapus gambar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload thumbnail
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleThumbnailChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1 text-sm text-gray-500">JPG, JPEG, PNG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.category_ids.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Published Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Publikasikan kursus
                </label>
              </div>

              {/* PDF Files */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Materi PDF (Opsional)
                  </label>
                  <button
                    type="button"
                    onClick={addPdfFile}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    Tambah PDF
                  </button>
                </div>

                {pdfFiles.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <FiFile className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Belum ada PDF yang ditambahkan</p>
                    <button
                      type="button"
                      onClick={addPdfFile}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Tambah PDF Pertama
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pdfFiles.map((pdf, index) => (
                      <motion.div 
                        key={pdf.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-medium text-gray-700">PDF {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removePdfFile(pdf.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600 mb-1">Judul PDF *</label>
                            <input
                              type="text"
                              value={pdf.title}
                              onChange={(e) => updatePdfFile(pdf.id, 'title', e.target.value)}
                              maxLength={255}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Masukkan judul PDF"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Urutan</label>
                            <input
                              type="number"
                              value={pdf.order_index}
                              onChange={(e) => updatePdfFile(pdf.id, 'order_index', parseInt(e.target.value) || 1)}
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block text-sm text-gray-600 mb-1">File PDF *</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            {pdf.file ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FiFile className="w-5 h-5 text-red-500" />
                                  <div>
                                    <span className="text-sm text-gray-700 font-medium">{pdf.file.name}</span>
                                    <p className="text-xs text-gray-500">
                                      {(pdf.file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => previewPdf(pdf.file!)}
                                    className="text-blue-600 hover:text-blue-800 p-1"
                                    title="Preview PDF"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updatePdfFile(pdf.id, 'file', null)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                    title="Hapus file"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="cursor-pointer block text-center">
                                <FiUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">Upload PDF</span>
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handlePdfFileChange(pdf.id, file);
                                  }}
                                  className="hidden"
                                />
                                <p className="text-xs text-gray-500 mt-1">PDF up to 10MB</p>
                              </label>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Link
                  href="/instruktur/course"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Kursus'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}