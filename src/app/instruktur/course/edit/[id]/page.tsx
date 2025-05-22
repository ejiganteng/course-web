'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CourseForm from '@/components/instruktur/course/CourseForm';
import { toast } from 'react-toastify';

interface Category {
  id: number;
  name: string;
}

interface CourseData {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  is_published: boolean;
  categories: number[];
  pdfs: Array<{
    id: number;
    title: string;
    order_index: number;
    file_path: string;
  }>;
}

export default function EditCourse({ params }: { params: { id: string } }) {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [courseRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (courseRes.ok && categoriesRes.ok) {
          const course = await courseRes.json();
          const categories = await categoriesRes.json();
          
          setCourseData(course.data);
          setAllCategories(categories.data);
        }
      } catch (error) {
        toast.error('Gagal memuat data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (formData: FormData, newPdfs: any[]) => {
    try {
      const token = localStorage.getItem('token');
      
      // Update course data
      const courseRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${params.id}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!courseRes.ok) {
        const error = await courseRes.json();
        throw new Error(error.message);
      }

      // Upload new PDFs
      if (newPdfs.length > 0) {
        const pdfFormData = new FormData();
        newPdfs.forEach((pdf, index) => {
          pdfFormData.append(`pdfs[${index}][title]`, pdf.title);
          pdfFormData.append(`pdfs[${index}][order_index]`, pdf.order.toString());
          if (pdf.file) {
            pdfFormData.append(`pdfs[${index}][file]`, pdf.file);
          }
        });

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${params.id}/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: pdfFormData,
          }
        );
      }

      toast.success('Kursus berhasil diperbarui!');
      window.location.href = '/instruktur/course';
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 ml-64">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="p-6 ml-64">
        <div className="text-red-500">Kursus tidak ditemukan</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 ml-64"
    >
      <h1 className="text-2xl font-bold mb-8">Edit Kursus</h1>
      
      <CourseForm 
        onSubmit={handleSubmit}
        initialData={{
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          thumbnail: courseData.thumbnail,
          is_published: courseData.is_published,
          category_ids: courseData.categories
        }}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">PDF Terpasang</h2>
        <div className="space-y-4">
          {courseData.pdfs.map((pdf) => (
            <motion.div
              key={pdf.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{pdf.title}</h3>
                <p className="text-sm text-gray-500">
                  Urutan: {pdf.order_index} | 
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/pdfs/${pdf.id}/download`}
                    className="text-indigo-600 ml-2"
                    download
                  >
                    Unduh
                  </a>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}