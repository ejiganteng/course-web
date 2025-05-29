'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiZoomIn, 
  FiZoomOut, 
  FiDownload,
  FiExternalLink,
  FiRefreshCw,
  FiMaximize,
  FiMinimize,
  FiFile,
  FiEye,
  FiAlertCircle,
  FiLoader,
  FiEdit,
  FiCheck,
  FiInfo,
  FiPlay,
  FiPause
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface PdfViewerProps {
  pdfPath?: string;
  pdfId?: string | number;
  title?: string;
  className?: string;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export default function PdfViewer({ 
  pdfPath, 
  pdfId, 
  title, 
  className = '', 
  onEdit,
  showEditButton = false 
}: PdfViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(100);
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [actualPdfId, setActualPdfId] = useState<string | number | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    if (pdfId) {
      setActualPdfId(pdfId);
    } else if (pdfPath) {
      console.warn('PdfViewer: pdfPath provided but pdfId is preferred for backend compatibility');
      console.log('Provided pdfPath:', pdfPath);
    }
  }, [pdfId, pdfPath]);

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  };

  const getDownloadEndpoint = () => {
    if (actualPdfId) {
      return `${process.env.NEXT_PUBLIC_API_URL}/pdfs/${actualPdfId}/download`;
    } else if (pdfPath) {
      const storagePath = pdfPath.replace('public/', 'storage/');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
      return `${baseUrl}/${storagePath}`;
    }
    return null;
  };

  const downloadEndpoint = getDownloadEndpoint();

  const loadPdfBlob = async () => {
    if (!downloadEndpoint) {
      setError('Tidak dapat menentukan endpoint PDF');
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingProgress(0);
    
    try {
      console.log('Loading PDF from endpoint:', downloadEndpoint);
      
      const response = await fetch(downloadEndpoint, {
        method: 'GET',
        headers: actualPdfId ? getAuthHeaders() : {},
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Response is not JSON, use status text
        }
        throw new Error(errorMessage);
      }

      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const blob = await response.blob();
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      if (!blob.type.includes('pdf') && blob.type !== 'application/octet-stream') {
        throw new Error('File yang dimuat bukan PDF yang valid');
      }

      const blobUrl = URL.createObjectURL(blob);
      setPdfBlob(blobUrl);
      setError(null);
      
      console.log('PDF loaded successfully:', {
        type: blob.type,
        size: `${(blob.size / 1024 / 1024).toFixed(2)} MB`,
        endpoint: downloadEndpoint
      });
      
    } catch (err) {
      console.error('Error loading PDF:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat PDF';
      setError(errorMessage);
      toast.error(`Gagal memuat PDF: ${errorMessage}`);
    } finally {
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  const handleDownload = async () => {
    if (!downloadEndpoint) {
      toast.error('Tidak dapat menentukan endpoint download');
      return;
    }

    try {
      setDownloadCount(prev => prev + 1);
      
      const response = await fetch(downloadEndpoint, {
        method: 'GET',
        headers: actualPdfId ? getAuthHeaders() : {},
      });

      if (!response.ok) {
        let errorMessage = 'Gagal mengunduh PDF';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || `PDF-${actualPdfId || 'document'}`}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF berhasil diunduh');
      
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengunduh PDF';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const openInNewTab = async () => {
    try {
      if (!pdfBlob) {
        toast.info('Memuat PDF...');
        await loadPdfBlob();
        return;
      }
      
      window.open(pdfBlob, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening in new tab:', error);
      toast.error('Gagal membuka PDF di tab baru');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => toast.error('Gagal masuk fullscreen'));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => toast.error('Gagal keluar fullscreen'));
    }
  };

  const retryLoad = () => {
    if (pdfBlob) {
      URL.revokeObjectURL(pdfBlob);
      setPdfBlob(null);
    }
    setError(null);
    loadPdfBlob();
  };

  const handleShowViewer = () => {
    setShowViewer(true);
    if (!pdfBlob && !loading) {
      loadPdfBlob();
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    if (pdfBlob) {
      URL.revokeObjectURL(pdfBlob);
      setPdfBlob(null);
    }
    setError(null);
  };

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, [pdfBlob]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex justify-center items-center h-20 ${className}`}>
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-200 border-t-emerald-600"></div>
        <span className="ml-2 text-emerald-700 text-sm">Memuat PDF viewer...</span>
      </div>
    );
  }

  if (!downloadEndpoint) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Konfigurasi PDF Tidak Valid</h3>
          <p className="text-red-600 mb-4">
            Tidak ada pdfId atau pdfPath yang valid. Pastikan komponen dipanggil dengan props yang benar.
          </p>
          <div className="bg-red-100 rounded-lg p-4 text-sm text-red-700">
            <p className="font-medium mb-2">Props yang diterima:</p>
            <ul className="text-left space-y-1">
              <li>• pdfId: {pdfId ? pdfId.toString() : 'undefined'}</li>
              <li>• pdfPath: {pdfPath || 'undefined'}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {/* PDF Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiFile className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {title || `PDF Document ${actualPdfId || 'Unknown'}`}
              </h4>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FiInfo className="w-4 h-4" />
                  {actualPdfId ? `ID: ${actualPdfId}` : 'File Path Mode'}
                </span>
                <span>•</span>
                <span>Siap untuk dilihat atau diunduh</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiCheck className="w-3 h-3 mr-1" />
                Tersedia
              </span>
              {downloadCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {downloadCount} unduhan
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-3">
            {!showViewer ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShowViewer}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg"
              >
                <FiEye className="w-4 h-4 mr-2" />
                Lihat PDF
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCloseViewer}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg"
              >
                <FiMinimize className="w-4 h-4 mr-2" />
                Tutup Viewer
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openInNewTab}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg"
            >
              <FiExternalLink className="w-4 h-4 mr-2" />
              Tab Baru
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Unduh
            </motion.button>

            {showEditButton && onEdit && actualPdfId && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onEdit}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg"
              >
                <FiEdit className="w-4 h-4 mr-2" />
                Edit
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* PDF Viewer Section */}
      <AnimatePresence>
        {showViewer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between bg-white/70 backdrop-blur-xl p-4 rounded-2xl gap-4 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <button
                    onClick={() => setScale(prev => Math.max(50, prev - 10))}
                    className="p-2 hover:bg-gray-50 transition-colors rounded-l-xl"
                    title="Perkecil"
                    disabled={loading}
                  >
                    <FiZoomOut className="w-4 h-4" />
                  </button>
                  
                  <span className="text-sm text-gray-700 px-4 py-2 min-w-[70px] text-center font-medium">
                    {scale}%
                  </span>
                  
                  <button
                    onClick={() => setScale(prev => Math.min(200, prev + 10))}
                    className="p-2 hover:bg-gray-50 transition-colors rounded-r-xl"
                    title="Perbesar"
                    disabled={loading}
                  >
                    <FiZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setScale(100)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm transition-colors shadow-sm"
                  title="Reset zoom"
                  disabled={loading}
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={retryLoad}
                  className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                  title="Muat ulang PDF"
                  disabled={loading}
                >
                  <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                  title={isFullscreen ? "Keluar fullscreen" : "Masuk fullscreen"}
                >
                  {isFullscreen ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* PDF Content */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-lg">
              {loading && (
                <div className="flex flex-col justify-center items-center h-80 p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-4">
                    <FiLoader className="w-6 h-6 text-emerald-600 animate-spin" />
                  </div>
                  <span className="text-base font-medium text-gray-800 mb-2">Memuat PDF...</span>
                  <p className="text-sm text-gray-500 mb-3">
                    {actualPdfId ? 'Mengunduh dari API...' : 'Memuat dari storage...'}
                  </p>
                  
                  {/* Loading Progress Bar */}
                  <div className="w-48 bg-gray-200 rounded-full h-1.5 mb-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{loadingProgress}%</span>
                </div>
              )}

              {error && (
                <div className="flex flex-col justify-center items-center h-80 text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
                    <FiAlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Gagal Memuat PDF</h3>
                  <p className="text-gray-600 mb-4 max-w-md leading-relaxed text-sm">
                    {error}
                  </p>
                  
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button 
                      onClick={retryLoad}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg text-sm"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Coba Lagi
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg text-sm"
                    >
                      <FiDownload className="w-4 h-4" />
                      Unduh Saja
                    </button>
                  </div>
                  
                  <details className="mt-4 text-left bg-gray-50 p-3 rounded-xl max-w-md w-full">
                    <summary className="cursor-pointer text-xs text-gray-600 font-medium mb-2">
                      Detail Error
                    </summary>
                    <div className="text-xs space-y-1 text-gray-500">
                      <div><strong>PDF ID:</strong> {actualPdfId || 'N/A'}</div>
                      <div><strong>PDF Path:</strong> {pdfPath || 'N/A'}</div>
                      <div><strong>Endpoint:</strong> {downloadEndpoint}</div>
                      <div><strong>Error:</strong> {error}</div>
                    </div>
                  </details>
                </div>
              )}

              {!loading && !error && pdfBlob && (
                <div className="relative" style={{ height: '600px' }}>
                  <iframe
                    ref={iframeRef}
                    src={pdfBlob}
                    className="w-full h-full rounded-2xl"
                    title={title || 'PDF Document'}
                    style={{ 
                      transform: `scale(${scale / 100})`, 
                      transformOrigin: 'top left',
                      width: `${100 / scale * 100}%`,
                      height: `${100 / scale * 100}%`
                    }}
                    onLoad={() => console.log('PDF iframe loaded successfully')}
                    onError={() => {
                      console.error('PDF iframe failed to load');
                      setError('PDF tidak dapat ditampilkan dalam iframe');
                    }}
                  />
                </div>
              )}
            </div>

            {/* Info Footer */}
            <div className="text-center p-4 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/20">
              <p className="text-xs text-gray-500">
                <strong>Mode:</strong>{' '}
                {actualPdfId ? (
                  <span className="text-emerald-600">API Endpoint (/api/pdfs/{actualPdfId}/download)</span>
                ) : (
                  <span className="text-blue-600">Storage Path ({pdfPath})</span>
                )}
                {' • '}
                {actualPdfId ? 'Menggunakan autentikasi Bearer token' : 'Akses langsung ke storage'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}