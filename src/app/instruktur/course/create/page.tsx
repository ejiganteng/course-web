'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { protectedFetch } from '@/utils/auth-utils';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
}

interface PDFFile {
  id: string;
  title: string;
  file: File | null;
  order_index: number;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: null as File | null,
    is_published: false,
    category_ids: [] as number[],
  });
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const addPDFFile = () => {
    const newPDF: PDFFile = {
      id: Date.now().toString(),
      title: '',
      file: null,
      order_index: pdfFiles.length + 1
    };
    setPdfFiles(prev => [...prev, newPDF]);
  };

  const removePDFFile = (id: string) => {
    setPdfFiles(prev => prev.filter(pdf => pdf.id !== id));
  };

  const updatePDFFile = (id: string, field: string, value: any) => {
    setPdfFiles(prev => prev.map(pdf => 
      pdf.id === id ? { ...pdf, [field]: value } : pdf
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.thumbnail) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setLoading(true);

    try {
      // Create course first
      const courseFormData = new FormData();
      courseFormData.append('title', formData.title);
      courseFormData.append('description', formData.description);
      courseFormData.append('price', formData.price);
      courseFormData.append('thumbnail', formData.thumbnail);
      courseFormData.append('is_published', formData.is_published ? '1' : '0');
      
      // Category IDs - sesuai dengan backend expectation
      if (formData.category_ids.length > 0) {
        formData.category_ids.forEach(id => {
          courseFormData.append('category_ids[]', id.toString());
        });
      }

      console.log('Creating course with data:');
      for (let [key, value] of courseFormData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const courseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          // Tidak menambahkan Content-Type, biarkan browser yang handle untuk FormData
        },
        body: courseFormData,
      });

      const responseText = await courseResponse.text();
      console.log('Course creation response status:', courseResponse.status);
      console.log('Course creation response:', responseText);

      if (!courseResponse.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.log('Error data:', errorData);
        } catch {
          errorData = { message: 'Gagal membuat course' };
        }
        
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors).map(([field, messages]) => {
            return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          });
          throw new Error(`Validasi gagal:\n${errorMessages.join('\n')}`);
        }
        
        throw new Error(errorData.message || 'Gagal membuat course');
      }

      const courseData = JSON.parse(responseText);
      const courseId = courseData.data.id;

      console.log('Course created successfully with ID:', courseId);

      // Upload PDFs if any
      if (pdfFiles.length > 0) {
        const validPDFs = pdfFiles.filter(pdf => pdf.title && pdf.file);
        
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
            const pdfResponseText = await pdfResponse.text();
            console.warn('PDF upload failed:', pdfResponseText);
            toast.warning('Course berhasil dibuat, tetapi ada masalah saat mengupload PDF');
          } else {
            console.log('PDFs uploaded successfully');
          }
        }
      }

      toast.success('Course berhasil dibuat');
      router.push('/instruktur/course');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
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
              <h1 className="text-3xl font-bold text-gray-800">Buat Course Baru</h1>
              <p className="text-gray-600">Lengkapi informasi course dan upload materi PDF</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
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
                    placeholder="Masukkan judul course"
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
                    placeholder="Jelaskan tentang course ini"
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
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Format: JPG, JPEG, PNG (Max: 10MB)</p>
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
                      Publish course (course akan langsung tersedia untuk siswa)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* PDF Materials */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Materi PDF</h2>
                <motion.button
                  type="button"
                  onClick={addPDFFile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <PlusIcon className="w-4 h-4" />
                  Tambah PDF
                </motion.button>
              </div>

              {pdfFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Belum ada materi PDF. Klik "Tambah PDF" untuk menambahkan materi.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pdfFiles.map((pdf, index) => (
                    <motion.div
                      key={pdf.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* PDF Title */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Judul Materi
                            </label>
                            <input
                              type="text"
                              value={pdf.title}
                              onChange={(e) => updatePDFFile(pdf.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              placeholder="Judul materi PDF"
                            />
                          </div>

                          {/* PDF File */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              File PDF
                            </label>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  updatePDFFile(pdf.id, 'file', file);
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Max: 10MB</p>
                          </div>

                          {/* Order Index */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Urutan
                            </label>
                            <input
                              type="number"
                              value={pdf.order_index}
                              onChange={(e) => updatePDFFile(pdf.id, 'order_index', parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              min="1"
                            />
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removePDFFile(pdf.id)}
                          className="flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link href="/instruktur/course">
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
                {loading ? 'Menyimpan...' : 'Buat Course'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}