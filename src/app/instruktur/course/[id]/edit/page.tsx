'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiUpload, 
  FiBookOpen,
  FiDollarSign,
  FiFileText,
  FiTag,
  FiImage,
  FiSave,
  FiEdit,
  FiRefreshCw
} from 'react-icons/fi';

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
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    is_published: false,
    category_ids: [] as number[],
  });
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchCourseDetail();
  }, [courseId]);

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
        const courseData = data.data;
        setCourse(courseData);
        
        setFormData({
          title: courseData.title,
          description: courseData.description || '',
          price: courseData.price,
          is_published: courseData.is_published,
          category_ids: courseData.categories.map((cat: any) => cat.id),
        });

        if (courseData.thumbnail) {
          setThumbnailPreview(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${courseData.thumbnail}`);
        }
      } else {
        toast.error('Gagal memuat data kursus');
        router.push('/instruktur/course');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Terjadi kesalahan saat memuat data');
      router.push('/instruktur/course');
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

  const validateForm = () => {
    if (formData.title && !formData.title.trim()) {
      toast.error('Judul kursus tidak boleh kosong');
      return false;
    }
    
    if (formData.price && parseFloat(formData.price) < 0) {
      toast.error('Harga tidak boleh negatif');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const hasNewThumbnail = thumbnail !== null;
      
      let response;
      
      if (hasNewThumbnail) {
        const formDataWithFile = new FormData();
        
        if (formData.title !== course?.title) {
          formDataWithFile.append('title', formData.title.trim());
        }
        if (formData.description !== course?.description) {
          formDataWithFile.append('description', formData.description.trim());
        }
        if (formData.price !== course?.price) {
          formDataWithFile.append('price', formData.price);
        }
        if (formData.is_published !== course?.is_published) {
          formDataWithFile.append('is_published', formData.is_published ? '1' : '0');
        }
        
        formDataWithFile.append('thumbnail', thumbnail);
        
        formData.category_ids.forEach(id => {
          formDataWithFile.append('category_ids[]', id.toString());
        });

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-HTTP-Method-Override': 'PUT'
          },
          body: formDataWithFile,
        });
      } else {
        const updateData: any = {};
        
        if (formData.title !== course?.title) {
          updateData.title = formData.title.trim();
        }
        if (formData.description !== course?.description) {
          updateData.description = formData.description.trim();
        }
        if (formData.price !== course?.price) {
          updateData.price = formData.price;
        }
        if (formData.is_published !== course?.is_published) {
          updateData.is_published = formData.is_published;
        }
        
        const currentCategoryIds = course?.categories.map(cat => cat.id).sort() || [];
        const newCategoryIds = formData.category_ids.sort();
        if (JSON.stringify(currentCategoryIds) !== JSON.stringify(newCategoryIds)) {
          updateData.category_ids = formData.category_ids;
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
      }

      if (response.ok) {
        toast.success('Kursus berhasil diperbarui');
        router.push(`/instruktur/course/${courseId}`);
      } else {
        const errorData = await response.json();
        
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach(key => {
            errorData.errors[key].forEach((error: string) => {
              toast.error(`${key}: ${error}`);
            });
          });
        } else {
          toast.error(errorData.message || 'Gagal memperbarui kursus');
        }
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
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
                href={`/instruktur/course/${courseId}`}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg"
              >
                <FiArrowLeft className="w-4 h-4" />
                Kembali
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiEdit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Edit Kursus
                  </h1>
                  <p className="text-slate-600 text-sm lg:text-base">
                    Perbarui informasi kursus
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
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-blue-50/50">
              <div className="flex items-center gap-3">
                <FiEdit className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Edit Informasi Kursus</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiBookOpen className="w-4 h-4 text-blue-600" />
                    Judul Kursus
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={255}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Masukkan judul kursus"
                  />
                  <p className="text-xs text-gray-500">
                    Karakter: {formData.title.length}/255
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiDollarSign className="w-4 h-4 text-blue-600" />
                    Harga
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiFileText className="w-4 h-4 text-blue-600" />
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="Deskripsi kursus..."
                />
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiImage className="w-4 h-4 text-blue-600" />
                  Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-colors">
                  {thumbnailPreview ? (
                    <div className="text-center">
                      <img 
                        src={thumbnailPreview} 
                        alt="Preview" 
                        className="mx-auto h-48 w-auto object-cover rounded-xl mb-4 shadow-lg"
                        onError={(e) => {
                          console.error('Thumbnail preview error');
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="flex justify-center gap-3">
                        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
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
                            setThumbnailPreview(course?.thumbnail ? 
                              `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${course.thumbnail}` : 
                              null
                            );
                          }}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <FiRefreshCw className="w-4 h-4" />
                          Reset
                        </button>
                      </div>
                      {thumbnail && (
                        <p className="text-sm text-green-600 mt-2 flex items-center justify-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Thumbnail baru akan diupload
                        </p>
                      )}
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
                        <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors inline-block">
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
                    <FiTag className="w-4 h-4 text-blue-600" />
                    Kategori
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center p-3 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.category_ids.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Published Status */}
              <div className="flex items-center p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                />
                <div>
                  <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Publikasikan kursus
                  </label>
                  <p className="text-xs text-gray-500">
                    Kursus akan dapat dilihat oleh peserta
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <Link
                  href={`/instruktur/course/${courseId}`}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-center"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      Simpan Perubahan
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