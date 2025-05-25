'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';

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
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  
  // Form state - sesuai CourseUpdateRequest (semua field optional dengan 'sometimes')
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
        
        // Set form data
        setFormData({
          title: courseData.title,
          description: courseData.description || '',
          price: courseData.price,
          is_published: courseData.is_published,
          category_ids: courseData.categories.map((cat: any) => cat.id),
        });

        // Set thumbnail preview dari storage path
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
    } finally {
      setFetchLoading(false);
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

  const validateForm = () => {
    // Sesuai CourseUpdateRequest - field bersifat 'sometimes' tapi jika ada harus valid
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
      
      // Check if we have a new thumbnail file
      const hasNewThumbnail = thumbnail !== null;
      
      let response;
      
      if (hasNewThumbnail) {
        // Use POST dengan FormData jika ada file baru (sesuai route backend)
        const formDataWithFile = new FormData();
        
        // Append only changed fields
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
        
        // Add category IDs
        formData.category_ids.forEach(id => {
          formDataWithFile.append('category_ids[]', id.toString());
        });

        console.log('Sending course update with file:');
        for (let [key, value] of formDataWithFile.entries()) {
          console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
          method: 'POST', // POST route untuk file upload
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-HTTP-Method-Override': 'PUT' // Laravel method override
          },
          body: formDataWithFile,
        });
      } else {
        // Use PUT dengan JSON jika tidak ada file baru
        const updateData: any = {};
        
        // Only send changed fields
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
        
        // Always send category_ids if different
        const currentCategoryIds = course?.categories.map(cat => cat.id).sort() || [];
        const newCategoryIds = formData.category_ids.sort();
        if (JSON.stringify(currentCategoryIds) !== JSON.stringify(newCategoryIds)) {
          updateData.category_ids = formData.category_ids;
        }

        console.log('Sending course update data:', updateData);

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
          method: 'PUT', // PUT route untuk update tanpa file
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
        console.error('Course update error:', errorData);
        
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

  if (fetchLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
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
      <div className="flex min-h-screen bg-gray-100">
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
              href={`/instruktur/course/${courseId}`}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Kursus</h1>
              <p className="text-gray-600">Perbarui informasi kursus</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Kursus
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={255}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan judul kursus"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
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
                  Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {thumbnailPreview ? (
                    <div className="text-center">
                      <img 
                        src={thumbnailPreview} 
                        alt="Preview" 
                        className="mx-auto h-32 w-auto object-cover rounded-lg mb-4"
                        onError={(e) => {
                          console.error('Thumbnail preview error');
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
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
                            // Reset to original thumbnail
                            setThumbnailPreview(course?.thumbnail ? 
                              `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${course.thumbnail}` : 
                              null
                            );
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Reset
                        </button>
                      </div>
                      {thumbnail && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ Thumbnail baru akan diupload
                        </p>
                      )}
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

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Link
                  href={`/instruktur/course/${courseId}`}
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
                    'Simpan Perubahan'
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