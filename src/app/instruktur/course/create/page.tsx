'use client';
import { motion } from 'framer-motion';
import CourseForm from '@/components/instruktur/course/CourseForm';
import { toast } from 'react-toastify';

export default function CreateCourse() {
  const handleSubmit = async (courseForm: FormData, pdfs: any[]) => {
    try {
      const token = localStorage.getItem('token');
      
      // 1. Create Course
      const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: courseForm,
      });

      if (!courseRes.ok) {
        const error = await courseRes.json();
        throw new Error(error.message || 'Gagal membuat kursus');
      }

      const courseData = await courseRes.json();
      const courseId = courseData.data.id;

      // 2. Upload PDFs
      if (pdfs.length > 0) {
        const pdfFormData = new FormData();
        
        pdfs.forEach((pdf, index) => {
          pdfFormData.append(`pdfs[${index}][title]`, pdf.title);
          pdfFormData.append(`pdfs[${index}][order_index]`, pdf.order.toString());
          pdfFormData.append(`pdfs[${index}][file]`, pdf.file);
        });

        const pdfRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: pdfFormData,
          }
        );

        if (!pdfRes.ok) {
          toast.warning('Kursus berhasil dibuat, namun gagal mengupload beberapa PDF');
        }
      }

      toast.success('Kursus berhasil dibuat!');
      window.location.href = '/instruktur/course';
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 ml-64"
    >
      <h1 className="text-2xl font-bold mb-8">Buat Kursus Baru</h1>
      <CourseForm onSubmit={handleSubmit} />
    </motion.div>
  );
}