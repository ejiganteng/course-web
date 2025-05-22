'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentArrowUpIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
}

interface PDFForm {
  title: string;
  order: number;
  file: File | null;
}

interface CourseFormProps {
  onSubmit: (courseData: FormData, pdfs: PDFForm[]) => void;
  initialData?: {
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    is_published: boolean;
    category_ids: number[];
  };
}

export default function CourseForm({ onSubmit, initialData }: CourseFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    is_published: initialData?.is_published || false,
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [pdfs, setPdfs] = useState<PDFForm[]>([{ title: '', order: 1, file: null }]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const { data } = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Gagal memuat kategori:', error);
      }
    };

    fetchCategories();

    if (initialData?.category_ids) {
      setSelectedCategories(initialData.category_ids);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('price', formData.price.toString());
    form.append('is_published', formData.is_published.toString());
    selectedCategories.forEach(id => form.append('category_ids[]', id.toString()));
    
    if (thumbnail) form.append('thumbnail', thumbnail);

    onSubmit(form, pdfs.filter(p => p.file !== null));
  };

  const addPdfField = () => {
    setPdfs([...pdfs, { 
      title: '', 
      order: pdfs.length + 1,
      file: null 
    }]);
  };

  const removePdfField = (index: number) => {
    const newPdfs = [...pdfs];
    newPdfs.splice(index, 1);
    setPdfs(newPdfs);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Judul Kursus</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Deskripsi</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded-md h-32"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-2">Harga (IDR)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium mb-2">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded-md"
          required={!initialData}
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium mb-2">Kategori</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map((category) => (
            <label 
              key={category.id}
              className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, category.id]);
                  } else {
                    setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                  }
                }}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* PDF Upload */}
      <div className="space-y-4">
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DocumentArrowUpIcon className="w-5 h-5" />
            Materi PDF
          </h3>
          
          {pdfs.map((pdf, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-4 border rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">PDF {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removePdfField(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Judul</label>
                  <input
                    type="text"
                    value={pdf.title}
                    onChange={(e) => {
                      const newPdfs = [...pdfs];
                      newPdfs[index].title = e.target.value;
                      setPdfs(newPdfs);
                    }}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Urutan</label>
                  <input
                    type="number"
                    value={pdf.order}
                    onChange={(e) => {
                      const newPdfs = [...pdfs];
                      newPdfs[index].order = Number(e.target.value);
                      setPdfs(newPdfs);
                    }}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">File PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const newPdfs = [...pdfs];
                      newPdfs[index].file = e.target.files?.[0] || null;
                      setPdfs(newPdfs);
                    }}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
            </motion.div>
          ))}

          <button
            type="button"
            onClick={addPdfField}
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Tambah PDF
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        {initialData ? 'Perbarui Kursus' : 'Buat Kursus Baru'}
      </button>
    </motion.form>
  );
}