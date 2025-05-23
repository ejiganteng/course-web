'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { protectedFetch } from '@/utils/auth-utils';

interface PdfItem {
  id: number;
  title: string;
  file_path: string;
  order_index: number;
  course_id: number;
}

interface PdfListProps {
  pdfs: PdfItem[];
  onUpdate: () => void;
}

export default function PdfList({ pdfs, onUpdate }: PdfListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEdit = (pdf: PdfItem) => {
    setEditingId(pdf.id);
    setEditTitle(pdf.title);
  };

  const handleSaveEdit = async (pdfId: number) => {
    if (!editTitle.trim()) {
      toast.error('Judul PDF tidak boleh kosong');
      return;
    }

    try {
      // Create FormData for PDF update
      const formData = new FormData();
      formData.append('pdfs[0][title]', editTitle);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/${pdfId}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Judul PDF berhasil diupdate');
        setEditingId(null);
        onUpdate();
      } else {
        const errorData = await response.json();
        console.error('PDF update error:', errorData);
        
        if (response.status === 403) {
          throw new Error('Anda tidak memiliki izin untuk mengupdate PDF ini');
        } else if (response.status === 422) {
          const errorMessages = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : errorData.message;
          throw new Error(`Validasi gagal: ${errorMessages}`);
        } else {
          throw new Error(errorData.message || 'Gagal mengupdate PDF');
        }
      }
    } catch (error) {
      console.error('Error updating PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengupdate PDF';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (pdfId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus PDF ini?')) return;

    try {
      const response = await protectedFetch(`/pdfs/${pdfId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('PDF berhasil dihapus');
        onUpdate();
      } else {
        throw new Error('Gagal menghapus PDF');
      }
    } catch (error) {
      toast.error('Gagal menghapus PDF');
      console.error('Error deleting PDF:', error);
    }
  };

  const handleDownload = async (pdfId: number, title: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/${pdfId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Gagal mendownload PDF');
      }
    } catch (error) {
      toast.error('Gagal mendownload PDF');
      console.error('Error downloading PDF:', error);
    }
  };

  const sortedPdfs = [...pdfs].sort((a, b) => a.order_index - b.order_index);

  if (sortedPdfs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>Belum ada materi PDF</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800 mb-4">Materi PDF Tersedia</h3>
      
      <AnimatePresence>
        {sortedPdfs.map((pdf, index) => (
          <motion.div
            key={pdf.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-red-100 rounded-lg">
                  <DocumentTextIcon className="w-5 h-5 text-red-600" />
                </div>
                
                <div className="flex-1">
                  {editingId === pdf.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(pdf.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(pdf.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-medium text-gray-800">{pdf.title}</h4>
                      <p className="text-sm text-gray-500">Urutan: {pdf.order_index + 1}</p>
                    </>
                  )}
                </div>
              </div>

              {editingId !== pdf.id && (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDownload(pdf.id, pdf.title)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(pdf)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Judul"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(pdf.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus PDF"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}