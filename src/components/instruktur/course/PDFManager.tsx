'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiX, 
  FiUpload, 
  FiFile, 
  FiPlus, 
  FiTrash2, 
  FiSave, 
  FiAlertCircle,
  FiFileText,
  FiEdit,
  FiCheck,
  FiInfo
} from 'react-icons/fi';

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
  } | null;
}

export default function PdfManager({ courseId, onClose, onSuccess, editPdf }: PdfManagerProps) {
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
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

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
    console.log('DEBUG:', info);
  };

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
    addDebugInfo(`File selected: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type}`);
    
    if (file.type !== 'application/pdf') {
      toast.error('File harus berupa PDF');
      addDebugInfo(`File rejected: Invalid type ${file.type}`);
      return;
    }
    
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSizeBytes) {
      toast.error('File PDF tidak boleh lebih dari 10MB');
      addDebugInfo(`File rejected: Size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds 10MB limit`);
      return;
    }

    if (file.size === 0) {
      toast.error('File tidak boleh kosong');
      addDebugInfo('File rejected: Empty file');
      return;
    }

    addDebugInfo(`File accepted: ${file.name}`);
    updatePdfFile(id, 'file', file);
  };

  const validateFiles = () => {
    addDebugInfo('Starting validation...');
    
    const hasEmptyTitles = pdfFiles.some(pdf => !pdf.title.trim());
    if (hasEmptyTitles) {
      toast.error('Judul PDF wajib diisi');
      addDebugInfo('Validation failed: Empty titles found');
      return false;
    }

    if (!editPdf) {
      const hasEmptyFiles = pdfFiles.some(pdf => !pdf.file);
      if (hasEmptyFiles) {
        toast.error('File PDF wajib diunggah');
        addDebugInfo('Validation failed: Missing files for upload');
        return false;
      }
    }

    const hasInvalidOrder = pdfFiles.some(pdf => isNaN(pdf.order_index) || pdf.order_index < 0);
    if (hasInvalidOrder) {
      toast.error('Urutan PDF harus berupa angka valid');
      addDebugInfo('Validation failed: Invalid order_index');
      return false;
    }

    addDebugInfo('Validation passed');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFiles()) return;

    setLoading(true);
    setDebugInfo([]);
    addDebugInfo('Starting submit process...');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (editPdf) {
        addDebugInfo('Edit mode: Updating existing PDF');
        const pdf = pdfFiles[0];
        const formData = new FormData();
        
        formData.append('pdfs[0][title]', pdf.title.trim());
        formData.append('pdfs[0][order_index]', pdf.order_index.toString());
        
        if (pdf.file) {
          addDebugInfo(`Adding file to FormData: ${pdf.file.name} (${pdf.file.size} bytes)`);
          formData.append('pdfs[0][file]', pdf.file);
        } else {
          addDebugInfo('No new file provided for edit - keeping existing file');
        }

        const updateUrl = `${process.env.NEXT_PUBLIC_API_URL}/pdfs/${editPdf.id}/update`;
        addDebugInfo(`Sending PUT request to: ${updateUrl}`);

        const response = await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        addDebugInfo(`Response status: ${response.status} ${response.statusText}`);

        if (response.ok) {
          const responseData = await response.json();
          addDebugInfo(`Success response: ${JSON.stringify(responseData)}`);
          toast.success('PDF berhasil diperbarui');
          onSuccess();
        } else {
          const errorData = await response.json();
          addDebugInfo(`Error response: ${JSON.stringify(errorData)}`);
          
          if (errorData.errors) {
            Object.keys(errorData.errors).forEach(key => {
              errorData.errors[key].forEach((error: string) => {
                toast.error(`${key}: ${error}`);
                addDebugInfo(`Validation error - ${key}: ${error}`);
              });
            });
          } else {
            toast.error(errorData.message || 'Gagal memperbarui PDF');
          }
        }
      } else {
        addDebugInfo('Upload mode: Creating new PDFs');
        const formData = new FormData();
        
        let validPdfCount = 0;
        pdfFiles.forEach((pdf, index) => {
          if (pdf.file && pdf.title.trim()) {
            addDebugInfo(`Adding PDF ${index + 1}: ${pdf.title} (${pdf.file.name})`);
            formData.append(`pdfs[${validPdfCount}][title]`, pdf.title.trim());
            formData.append(`pdfs[${validPdfCount}][file]`, pdf.file);
            formData.append(`pdfs[${validPdfCount}][order_index]`, pdf.order_index.toString());
            validPdfCount++;
          }
        });

        if (validPdfCount === 0) {
          throw new Error('No valid PDFs to upload');
        }

        const uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/upload`;
        addDebugInfo(`Sending POST request to: ${uploadUrl}`);

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        addDebugInfo(`Response status: ${response.status} ${response.statusText}`);

        if (response.ok) {
          const responseData = await response.json();
          addDebugInfo(`Success response: ${JSON.stringify(responseData)}`);
          toast.success('PDF berhasil ditambahkan');
          onSuccess();
        } else {
          const errorData = await response.json();
          addDebugInfo(`Error response: ${JSON.stringify(errorData)}`);
          
          if (errorData.errors) {
            Object.keys(errorData.errors).forEach(key => {
              errorData.errors[key].forEach((error: string) => {
                toast.error(`${key}: ${error}`);
                addDebugInfo(`Validation error - ${key}: ${error}`);
              });
            });
          } else {
            toast.error(errorData.message || 'Gagal upload PDF');
          }
        }
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      addDebugInfo(`Submit error: ${error.message || error}`);
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
      addDebugInfo('Submit process completed');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 lg:pl-72"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/20 relative"
        >
          {/* Close button - positioned to avoid navbar collision */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 hover:bg-gray-100 rounded-lg transition-colors bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg"
            disabled={loading}
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 lg:p-6 text-white">
            <div className="flex justify-between items-center pr-10 lg:pr-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  {editPdf ? <FiEdit className="w-4 h-4 lg:w-5 lg:h-5" /> : <FiFileText className="w-4 h-4 lg:w-5 lg:h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg lg:text-xl font-bold truncate">
                    {editPdf ? 'Edit PDF' : 'Tambah PDF ke Kursus'}
                  </h2>
                  <p className="text-emerald-100 text-xs lg:text-sm truncate">
                    {editPdf ? 'Perbarui informasi PDF' : 'Upload file PDF untuk kursus'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto max-h-[60vh] lg:max-h-[70vh]">
              <div className="space-y-6">
                {!editPdf && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-3 lg:p-4 border border-emerald-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <p className="text-emerald-700 font-medium text-xs lg:text-sm">
                        Upload satu atau lebih file PDF untuk ditambahkan ke kursus
                      </p>
                      <button
                        onClick={addPdfFile}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 lg:px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-xs lg:text-sm transition-colors shadow-lg whitespace-nowrap"
                      >
                        <FiPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Tambah PDF</span>
                        <span className="sm:hidden">Tambah</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <AnimatePresence>
                    {pdfFiles.map((pdf, index) => (
                      <motion.div
                        key={pdf.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-r from-white to-emerald-50/30 border border-emerald-200 rounded-2xl p-6 shadow-lg"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                              <FiFile className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">
                                {editPdf ? 'Edit PDF' : `PDF ${index + 1}`}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {editPdf ? 'Perbarui informasi PDF' : 'Konfigurasi file PDF baru'}
                              </p>
                            </div>
                          </div>
                          {!editPdf && pdfFiles.length > 1 && (
                            <button
                              onClick={() => removePdfFile(pdf.id)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                              <FiFileText className="w-4 h-4 text-emerald-600" />
                              Judul PDF *
                            </label>
                            <input
                              type="text"
                              value={pdf.title}
                              onChange={(e) => updatePdfFile(pdf.id, 'title', e.target.value)}
                              maxLength={255}
                              disabled={loading}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                              placeholder="Masukkan judul PDF yang deskriptif"
                              required
                            />
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500">
                                Karakter: {pdf.title.length}/255
                              </p>
                              {pdf.title.length > 200 && (
                                <p className="text-xs text-orange-500 flex items-center gap-1">
                                  <FiAlertCircle className="w-3 h-3" />
                                  Mendekati batas maksimal
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                              <FiCheck className="w-4 h-4 text-emerald-600" />
                              Urutan
                            </label>
                            <input
                              type="number"
                              value={pdf.order_index}
                              onChange={(e) => updatePdfFile(pdf.id, 'order_index', parseInt(e.target.value) || 0)}
                              min="0"
                              max="9999"
                              disabled={loading}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500">
                              Urutan tampil PDF (0-9999)
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <FiUpload className="w-4 h-4 text-emerald-600" />
                            File PDF {!editPdf && '*'}
                          </label>
                          <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-8 hover:border-emerald-300 transition-colors">
                            {pdf.file ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <FiFile className="w-8 h-8 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-800 text-lg">{pdf.file.name}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                      <span className="flex items-center gap-1">
                                        <FiInfo className="w-4 h-4" />
                                        {(pdf.file.size / 1024 / 1024).toFixed(2)} MB
                                      </span>
                                      <span>•</span>
                                      <span>{pdf.file.type}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                      Dimodifikasi: {new Date(pdf.file.lastModified).toLocaleString('id-ID')}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => updatePdfFile(pdf.id, 'file', null)}
                                  disabled={loading}
                                  className="text-red-600 hover:text-red-800 disabled:opacity-50 p-3 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                  <FiTrash2 className="w-5 h-5" />
                                </button>
                              </div>
                            ) : (
                              <label className={`cursor-pointer block ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                                <div className="text-center">
                                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiUpload className="w-8 h-8 text-emerald-600" />
                                  </div>
                                  <span className="block text-lg font-bold text-gray-800 mb-2">
                                    {editPdf ? 'Upload file baru (opsional)' : 'Upload file PDF'}
                                  </span>
                                  <span className="block text-sm text-gray-500 mb-4">
                                    PDF hingga 10MB • Format: .pdf
                                  </span>
                                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-colors inline-block shadow-lg">
                                    Pilih File PDF
                                  </span>
                                </div>
                                <input
                                  type="file"
                                  accept=".pdf,application/pdf"
                                  disabled={loading}
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
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-700 flex items-center gap-2">
                                <FiInfo className="w-4 h-4" />
                                File saat ini akan tetap digunakan jika tidak ada file baru yang diupload
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Debug Panel */}
            {debugInfo.length > 0 && (
              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-gray-50 flex flex-col max-h-64 lg:max-h-auto">
                <div className="p-3 lg:p-4 border-b bg-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiAlertCircle className="w-4 h-4 text-blue-500" />
                      <h3 className="text-sm font-semibold text-gray-700">Debug Info</h3>
                    </div>
                    <button
                      onClick={() => setShowDebug(!showDebug)}
                      className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
                      disabled={loading}
                    >
                      {showDebug ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                </div>
                {showDebug && (
                  <div className="flex-1 p-3 lg:p-4 overflow-y-auto max-h-48 lg:max-h-96">
                    <div className="space-y-2">
                      {debugInfo.map((info, index) => (
                        <div key={index} className="text-xs text-gray-600 font-mono bg-white p-2 rounded border border-gray-200 break-all">
                          {info}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 lg:p-6 border-t bg-gradient-to-r from-gray-50 to-emerald-50 gap-3 lg:gap-4">
            <div className="text-xs lg:text-sm text-gray-600 order-2 sm:order-1">
              {editPdf ? (
                <span className="flex items-center gap-2">
                  <FiEdit className="w-3 h-3 lg:w-4 lg:h-4" />
                  Mode Edit PDF
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FiFileText className="w-3 h-3 lg:w-4 lg:h-4" />
                  {pdfFiles.length} PDF siap diupload
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full sm:w-auto order-1 sm:order-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 lg:px-6 py-2 lg:py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 lg:px-8 py-2 lg:py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 shadow-lg text-sm font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-2 border-white border-t-transparent"></div>
                    <span className="hidden sm:inline">{editPdf ? 'Memperbarui...' : 'Mengupload...'}</span>
                    <span className="sm:hidden">{editPdf ? 'Update...' : 'Upload...'}</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">{editPdf ? 'Perbarui PDF' : 'Upload PDF'}</span>
                    <span className="sm:hidden">{editPdf ? 'Perbarui' : 'Upload'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}