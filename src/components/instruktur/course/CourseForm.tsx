'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  PhotoIcon, 
  XMarkIcon,
  PlusIcon 
} from '@heroicons/react/24/solid';
import { protectedFetch } from '@/utils/auth-utils';
import PdfUpload from './PdfUpload';
import PdfList from './PdfList';

interface Category {
  id: number;
  name: string;
}

interface CourseFormProps {
  mode: 'create' | 'edit';
  courseId?: number;
  initialData?: any;
}

interface PdfFile {
  id?: number;
  title: string;
  file: File | null;
  order_index: number;
  file_path?: string;
}

export default function CourseForm({ mode, courseId, initialData }: CourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: null as File | null,
    is_published: false,
    category_ids: [] as number[],
  });

  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [existingPdfs, setExistingPdfs] = useState<any[]>([]);

  // Fetch categories
  const fetchCategories = async (): Promise<void> => {
    try {
      const response: Response = await protectedFetch('/categories');
      if (response.ok) {
        const data: any = await response.json();
        setCategories(data.data);
      }
    } catch (error) {
      toast.error('Gagal memuat kategori');
    }
  };

  // Fetch course data for edit mode
  const fetchCourseData = async (): Promise<void> => {
    if (mode === 'edit' && courseId) {
      try {
        const response: Response = await protectedFetch(`/courses/${courseId}`);
        if (response.ok) {
          const data: any = await response.json();
          const course: any = data.data;
          
          setFormData({
            title: course.title,
            description: course.description || '',
            price: course.price.toString(),
            thumbnail: null,
            is_published: course.is_published,
            category_ids: course.categories.map((cat: Category) => cat.id),
          });

          // Set thumbnail preview
          if (course.thumbnail) {
            const thumbnailUrl: string = course.thumbnail.startsWith('http') 
              ? course.thumbnail 
              : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${course.thumbnail}`;
            setThumbnailPreview(thumbnailUrl);
          }

          // Set existing PDFs
          setExistingPdfs(course.pdfs || []);
          
          // Set new PDFs for upload (empty initially in edit mode)
          setPdfFiles([]);
        }
      } catch (error) {
        toast.error('Gagal memuat data course');
      }
    }
  };

  // Refetch course data (for PDF updates)
  const refetchCourseData = async (): Promise<void> => {
    if (mode === 'edit' && courseId) {
      try {
        const response: Response = await protectedFetch(`/courses/${courseId}`);
        if (response.ok) {
          const data: any = await response.json();
          setExistingPdfs(data.data.pdfs || []);
        }
      } catch (error) {
        console.error('Failed to refetch course data:', error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCourseData();
  }, [mode, courseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 10MB');
        return;
      }

      // Validate file name
      if (file.name.length > 100) {
        toast.error('Nama file terlalu panjang');
        return;
      }

      setFormData(prev => ({ ...prev, thumbnail: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validasi
      if (!formData.title.trim()) {
        throw new Error('Judul course harus diisi');
      }
      
      if (formData.title.length > 255) {
        throw new Error('Judul course tidak boleh lebih dari 255 karakter');
      }
      
      if (!formData.price || parseFloat(formData.price) < 0) {
        throw new Error('Harga harus valid dan tidak boleh negatif');
      }

      if (parseFloat(formData.price) > 999999999) {
        throw new Error('Harga terlalu besar');
      }

      if (mode === 'create' && !formData.thumbnail) {
        throw new Error('Thumbnail harus diupload untuk course baru');
      }

      if (formData.description && formData.description.length > 10000) {
        throw new Error('Deskripsi terlalu panjang (maksimal 10.000 karakter)');
      }

      let response: Response;
      let newCourseId: number;

      if (mode === 'create') {
        // CREATE MODE - use FormData
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);
        submitData.append('is_published', formData.is_published ? '1' : '0');
        
        if (formData.thumbnail) {
          submitData.append('thumbnail', formData.thumbnail);
        }

        if (formData.category_ids.length > 0) {
          formData.category_ids.forEach((id, index) => {
            submitData.append(`category_ids[${index}]`, id.toString());
          });
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          },
          body: submitData,
        });

      } else {
        // EDIT MODE - use FormData for file upload or JSON for simple updates
        if (formData.thumbnail) {
          // If thumbnail is being updated, use FormData
          const submitData = new FormData();
          submitData.append('title', formData.title);
          submitData.append('description', formData.description);
          submitData.append('price', formData.price);
          submitData.append('is_published', formData.is_published ? '1' : '0');
          submitData.append('thumbnail', formData.thumbnail);

          if (formData.category_ids.length > 0) {
            formData.category_ids.forEach((id, index) => {
              submitData.append(`category_ids[${index}]`, id.toString());
            });
          }

          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json',
            },
            body: submitData,
          });
        } else {
          // No file upload, use JSON
          const submitData = {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            is_published: formData.is_published,
            category_ids: formData.category_ids,
          };

          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json',
            },
            body: JSON.stringify(submitData),
          });
        }
      }

      console.log('Course submission response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Course submission error:', errorData);
        
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        
        throw new Error(errorData.message || 'Gagal menyimpan course');
      }

      const courseData: any = await response.json();
      newCourseId = mode === 'create' ? courseData.data.id : courseId!;

      // Upload PDFs if any (only for create mode or if there are new PDFs)
      if (pdfFiles.length > 0) {
        try {
          await uploadPdfs(newCourseId);
        } catch (pdfError) {
          console.error('PDF upload failed:', pdfError);
          toast.error(`Course berhasil ${mode === 'create' ? 'dibuat' : 'diupdate'}, tapi gagal upload PDF: ${(pdfError as Error).message}`);
          toast.info('Anda bisa upload PDF nanti melalui halaman edit course');
        }
      }

      toast.success(mode === 'create' ? 'Course berhasil dibuat' : 'Course berhasil diupdate');
      router.push('/instruktur/course');

    } catch (error) {
      const err = error as Error;
      console.error('Course submission error:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadPdfs = async (targetCourseId: number): Promise<void> => {
    const newPdfs = pdfFiles.filter(pdf => pdf.file && !pdf.id);
    
    if (newPdfs.length === 0) return;

    const pdfFormData = new FormData();
    
    newPdfs.forEach((pdf, index) => {
      pdfFormData.append(`pdfs[${index}][title]`, pdf.title);
      pdfFormData.append(`pdfs[${index}][file]`, pdf.file!);
      pdfFormData.append(`pdfs[${index}][order_index]`, pdf.order_index.toString());
    });

    console.log('Uploading PDFs to course:', targetCourseId);
    console.log('PDF count:', newPdfs.length);

    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${targetCourseId}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
        // Don't set Content-Type, let browser set it with boundary for FormData
      },
      body: pdfFormData,
    });

    console.log('PDF upload response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PDF upload error:', errorData);
      
      // Show specific error message
      if (response.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk upload PDF ke course ini. Pastikan Anda adalah pembuat course.');
      } else if (response.status === 422) {
        const errorMessages = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : errorData.message;
        throw new Error(`Validasi PDF gagal: ${errorMessages}`);
      } else {
        throw new Error(errorData.message || 'Gagal mengupload PDF');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Informasi Dasar</h2>
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Course *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Masukkan judul course"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Masukkan deskripsi course"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Harga (IDR) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="1000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="0"
            required
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail {mode === 'create' && '*'}
          </label>
          <div className="mt-2">
            {thumbnailPreview ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailPreview('');
                    setFormData(prev => ({ ...prev, thumbnail: null }));
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <PhotoIcon className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Upload</span>
                <input
                  type="file"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.category_ids.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Published Status */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleInputChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Publish course sekarang</span>
          </label>
        </div>
      </div>

      {/* PDF Upload Section */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Materi PDF</h2>
        
        {/* Existing PDFs (Edit Mode) */}
        {mode === 'edit' && existingPdfs.length > 0 && (
          <div className="mb-8">
            <PdfList 
              pdfs={existingPdfs} 
              onUpdate={refetchCourseData}
            />
          </div>
        )}
        
        {/* New PDF Upload */}
        <div className={mode === 'edit' && existingPdfs.length > 0 ? 'border-t pt-6' : ''}>
          {mode === 'edit' && existingPdfs.length > 0 && (
            <h3 className="text-lg font-medium text-gray-700 mb-4">Tambah Materi Baru</h3>
          )}
          <PdfUpload 
            pdfFiles={pdfFiles} 
            setPdfFiles={setPdfFiles}
            mode={mode}
            courseId={courseId}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : (mode === 'create' ? 'Buat Course' : 'Update Course')}
        </motion.button>
      </div>
    </form>
  );
}