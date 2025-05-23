'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  XMarkIcon, 
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon 
} from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { protectedFetch } from '@/utils/auth-utils';

interface PdfFile {
  id?: number;
  title: string;
  file: File | null;
  order_index: number;
  file_path?: string;
}

interface PdfUploadProps {
  pdfFiles: PdfFile[];
  setPdfFiles: React.Dispatch<React.SetStateAction<PdfFile[]>>;
  mode: 'create' | 'edit';
  courseId?: number;
}

export default function PdfUpload({ pdfFiles, setPdfFiles, mode, courseId }: PdfUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const addPdfFile = () => {
    const newPdf: PdfFile = {
      title: '',
      file: null,
      order_index: pdfFiles.length,
    };
    setPdfFiles(prev => [...prev, newPdf]);
  };

  const updatePdfFile = (index: number, field: keyof PdfFile, value: any) => {
    setPdfFiles(prev => prev.map((pdf, i) => 
      i === index ? { ...pdf, [field]: value } : pdf
    ));
  };

  const removePdfFile = async (index: number) => {
    const pdf = pdfFiles[index];
    
    // If it's an existing PDF, delete from server
    if (pdf.id && mode === 'edit') {
      try {
        const response = await protectedFetch(`/pdfs/${pdf.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          toast.success('PDF berhasil dihapus');
        } else {
          throw new Error('Gagal menghapus PDF');
        }
      } catch (error) {
        toast.error('Gagal menghapus PDF dari server');
        return;
      }
    }

    setPdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pdfFiles.length) return;

    setPdfFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      
      // Update order_index
      newFiles.forEach((file, i) => {
        file.order_index = i;
      });
      
      return newFiles;
    });
  };

  const handleFileChange = (index: number, file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('File harus berformat PDF');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB');
      return;
    }

    // Validate file name
    if (file.name.length > 100) {
      toast.error('Nama file terlalu panjang (maksimal 100 karakter)');
      return;
    }

    updatePdfFile(index, 'file', file);
    
    // Auto-generate title from filename if empty
    if (!pdfFiles[index].title) {
      const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ').trim();
      updatePdfFile(index, 'title', fileName);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileChange(index, pdfFile);
    } else {
      toast.error('File harus berformat PDF');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {pdfFiles.map((pdf, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Title Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Materi
                </label>
                <input
                  type="text"
                  value={pdf.title}
                  onChange={(e) => updatePdfFile(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Masukkan judul materi"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File PDF
                </label>
                <div
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
                    dragOver 
                      ? 'border-purple-400 bg-purple-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {pdf.file || pdf.file_path ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <DocumentTextIcon className="w-5 h-5 text-green-600" />
                      <span>{pdf.file ? pdf.file.name : 'File sudah ada'}</span>
                    </div>
                  ) : (
                    <>
                      <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Drop PDF atau klik upload</p>
                    </>
                  )}
                  
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(index, file);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Urutan: {index + 1}
              </div>
              
              <div className="flex gap-2">
                {/* Move Up */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => moveFile(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                </motion.button>

                {/* Move Down */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => moveFile(index, 'down')}
                  disabled={index === pdfFiles.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowDownIcon className="w-4 h-4" />
                </motion.button>

                {/* Remove */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removePdfFile(index)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add PDF Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addPdfFile}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-purple-400 hover:text-purple-600 transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        Tambah Materi PDF
      </motion.button>

      {pdfFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <DocumentTextIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Tips Upload PDF:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Maksimal ukuran file 10MB per PDF</li>
                <li>Gunakan judul yang jelas dan deskriptif</li>
                <li>Atur urutan materi sesuai alur pembelajaran</li>
                <li>PDF akan diupload setelah course berhasil disimpan</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}