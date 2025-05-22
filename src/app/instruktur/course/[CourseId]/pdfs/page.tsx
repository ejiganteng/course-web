'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PDFItem from '@/components/instruktur/course/PDFItem';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

export default function PDFManagement({ params }: { params: { id: string } }) {
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    order_index: 0,
    file: null as File | null,
  });

  useEffect(() => {
    const fetchPDFs = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${params.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (res.ok) {
          const { data } = await res.json();
          setPdfs(data.pdfs);
        }
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };
    
    fetchPDFs();
  }, [params.id]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    data.append('pdfs[0][title]', formData.title);
    data.append('pdfs[0][order_index]', formData.order_index.toString());
    if (formData.file) data.append('pdfs[0][file]', formData.file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${params.id}/upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      if (res.ok) {
        const { pdfs: newPDFs } = await res.json();
        setPdfs([...pdfs, ...newPDFs]);
        setFormData({ title: '', order_index: 0, file: null });
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 ml-64"
    >
      <h1 className="text-2xl font-bold mb-8">Kelola PDF</h1>
      
      <motion.form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded-xl shadow-lg mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Judul PDF</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Urutan</label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">File PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <DocumentArrowUpIcon className="w-5 h-5" />
          Upload PDF
        </button>
      </motion.form>

      <div className="space-y-4">
        {pdfs.map((pdf) => (
          <PDFItem key={pdf.id} pdf={pdf} courseId={params.id} />
        ))}
      </div>
    </motion.div>
  );
}