'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiX, FiUpload, FiFile, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

interface PdfFile {
  id: string;
  title: string;
  file: File | null;
  order_index: number;
}

interface PdfManagerProps {
  courseId: number;
  onClose: () => void;
  onSuccess: () => void;
  editPdf?: {
    id: number;
    title: string;
    order_index: number;
  };
}

export default function PdfManager({ courseId, onClose, onSuccess, editPdf }: PdfManagerProps) {
  const [loading, setLoading] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>(
    editPdf ? [
      {
        id: 'edit',
        title: editPdf.title,
        file: null,
        order_index: editPdf.order_index,
      }
    ] : [
      {
        id: Date.now().toString(),
        title: '',
        file: null,
        order_index: 1,
      }
    ]
  );

  const addPdfFile = () => {
    const newPdf: PdfFile = {
      id: Date.now().toString(),
      title: '',
      file: null,
      order_index: Math.max(...pdfFiles.map(p => p.order_index), 0) + 1,
    };
    setPdfFiles(prev => [...prev, newPdf]);
  };

  const removePdfFile = (id: string) => {
    if (pdfFiles.length === 1) {
      toast.warning('Minimal harus ada satu PDF');
      return;
    }
    setPdfFiles(prev => prev.filter(pdf => pdf.id !== id));
  };

  const updatePdfFile = (id: string, field: keyof PdfFile, value: any) => {
    setPdfFiles(prev => prev.map(pdf => 
      pdf.id === id ? { ...pdf, [field]: value } : pdf
    ));
  };

  const handleFileChange = (id: string, file: File) => {
    // Validate file type - hanya PDF
    if (file.type !== 'application/pdf') {
      toast.error('File harus berupa PDF');
      return;
    }
    
    // Validate file size (10MB = 10240KB)
    if (file.size > 10240 * 1024) {
      toast.error('File PDF tidak boleh lebih dari 10MB');
      return;
    }

    updatePdfFile(id, 'file', file);
  };

  const validateFiles = () => {
    // Check if all files have titles (sesuai PdfRequest: required)
    const hasEmptyTitles = pdfFiles.some(pdf => !pdf.title.trim());
    if (hasEmptyTitles) {
      toast.error('Judul PDF wajib diisi');
      return false;
    }

    // For new uploads, check if all files are selected (sesuai PdfRequest: required)
    if (!editPdf) {
      const hasEmptyFiles = pdfFiles.some(pdf => !pdf.file);
      if (hasEmptyFiles) {
        toast.error('File PDF wajib diunggah');
        return false;
      }
    }

    // For edit mode, file is optional (nullable in update validation)
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFiles()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (editPdf) {
        // Update existing PDF - sesuai backend update endpoint
        const pdf = pdfFiles[0];
        const formData = new FormData();
        
        // Format sesuai backend validation di update method
        formData.append('pdfs[0][title]', pdf.title.trim());
        formData.append('pdfs[0][order_index]', pdf.order_index.toString());
        
        if (pdf.file) {
          formData.append('pdfs[0][file]', pdf.file);
        }

        console.log('Updating PDF with data:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/${editPdf.id}/update`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            // FormData akan set Content-Type otomatis
          },
          body: formData,
        });

        if (response.ok) {
          toast.success('PDF berhasil diperbarui');
          onSuccess();
        } else {
          const errorData = await response.json();
          console.error('PDF update error:', errorData);
          
          if (errorData.errors) {
            Object.keys(errorData.errors).forEach(key => {
              errorData.errors[key].forEach((error: string) => {
                toast.error(`${key}: ${error}`);
              });
            });
          } else {
            toast.error(errorData.message || 'Gagal memperbarui PDF');
          }
        }
      } else {
        // Upload new PDFs - sesuai PdfRequest format
        const formData = new FormData();
        
        pdfFiles.forEach((pdf, index) => {
          if (pdf.file && pdf.title.trim()) {
            formData.append(`pdfs[${index}][title]`, pdf.title.trim());
            formData.append(`pdfs[${index}][file]`, pdf.file);
            formData.append(`pdfs[${index}][order_index]`, pdf.order_index.toString());
          }
        });

        console.log('Uploading PDFs with data:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          toast.success('PDF berhasil ditambahkan');
          onSuccess();
        } else {
          const errorData = await response.json();
          console.error('PDF upload error:', errorData);
          
          if (errorData.errors) {
            Object.keys(errorData.errors).forEach(key => {
              errorData.errors[key].forEach((error: string) => {
                toast.error(`${key}: ${error}`);
              });
            });
          } else {
            toast.error(errorData.message || 'Gagal upload PDF');
          }
        }
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {editPdf ? 'Edit PDF' : 'Tambah PDF ke Kursus'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-6">
              {!editPdf && (
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    Upload satu atau lebih file PDF untuk ditambahkan ke kursus
                  </p>
                  <button
                    onClick={addPdfFile}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    Tambah PDF
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {pdfFiles.map((pdf, index) => (
                  <motion.div
                    key={pdf.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-medium text-gray-700">
                        {editPdf ? 'Edit PDF' : `PDF ${index + 1}`}
                      </h4>
                      {!editPdf && pdfFiles.length > 1 && (
                        <button
                          onClick={() => removePdfFile(pdf.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Judul PDF *
                        </label>
                        <input
                          type="text"
                          value={pdf.title}
                          onChange={(e) => updatePdfFile(pdf.id, 'title', e.target.value)}
                          maxLength={255}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Masukkan judul PDF"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Urutan
                        </label>
                        <input
                          type="number"
                          value={pdf.order_index}
                          onChange={(e) => updatePdfFile(pdf.id, 'order_index', parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File PDF {!editPdf && '*'}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        {pdf.file ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FiFile className="w-8 h-8 text-red-500" />
                              <div>
                                <p className="font-medium text-gray-800">{pdf.file.name}</p>
                                <p className="text-sm text-gray-500">
                                  {(pdf.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => updatePdfFile(pdf.id, 'file', null)}
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer block">
                            <div className="text-center">
                              <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                              <span className="block text-sm font-medium text-gray-900 mb-2">
                                {editPdf ? 'Upload file baru (opsional)' : 'Upload file PDF'}
                              </span>
                              <span className="block text-sm text-gray-500">
                                PDF up to 10MB
                              </span>
                            </div>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileChange(pdf.id, file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      {editPdf && !pdf.file && (
                        <p className="text-sm text-gray-500 mt-2">
                          File saat ini akan tetap digunakan jika tidak ada file baru yang diupload
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editPdf ? 'Memperbarui...' : 'Mengupload...'}
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  {editPdf ? 'Perbarui PDF' : 'Upload PDF'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}