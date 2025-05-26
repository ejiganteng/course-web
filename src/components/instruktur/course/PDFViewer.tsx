'use client';

import { useState, useEffect, useRef } from 'react';
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
  FiEdit
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface PdfViewerProps {
  pdfPath?: string;        // Untuk compatibility dengan CourseDetailPage
  pdfId?: string | number; // Untuk direct ID usage
  title?: string;
  className?: string;
  onEdit?: () => void;     // Callback untuk edit PDF
  showEditButton?: boolean; // Show edit button
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Determine PDF ID from props
    if (pdfId) {
      setActualPdfId(pdfId);
    } else if (pdfPath) {
      // Extract PDF ID from path or use path as fallback
      // Ini akan digunakan jika dipanggil dari CourseDetailPage
      // Kita perlu mendapatkan ID PDF dari context atau props lain
      console.warn('PdfViewer: pdfPath provided but pdfId is preferred for backend compatibility');
      console.log('Provided pdfPath:', pdfPath);
    }
  }, [pdfId, pdfPath]);

  // Function to get auth headers - sama seperti di PdfManager
  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  };

  // Determine endpoint based on available props
  const getDownloadEndpoint = () => {
    if (actualPdfId) {
      return `${process.env.NEXT_PUBLIC_API_URL}/pdfs/${actualPdfId}/download`;
    } else if (pdfPath) {
      // Fallback: construct URL from storage path
      const storagePath = pdfPath.replace('public/', 'storage/');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
      return `${baseUrl}/${storagePath}`;
    }
    return null;
  };

  const downloadEndpoint = getDownloadEndpoint();

  // Load PDF as blob for inline viewing
  const loadPdfBlob = async () => {
    if (!downloadEndpoint) {
      setError('Tidak dapat menentukan endpoint PDF');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading PDF from endpoint:', downloadEndpoint);
      
      const response = await fetch(downloadEndpoint, {
        method: 'GET',
        headers: actualPdfId ? getAuthHeaders() : {}, // Only use auth for API endpoints
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

      const blob = await response.blob();
      
      // Validasi tipe file
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
    }
  };

  // Direct download function
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

  // Open in new tab dengan blob URL
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
      <div className={`flex justify-center items-center h-32 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Memuat PDF viewer...</span>
      </div>
    );
  }

  if (!downloadEndpoint) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FiAlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Konfigurasi PDF Tidak Valid</h3>
          <p className="text-red-600">
            Tidak ada pdfId atau pdfPath yang valid. Pastikan komponen dipanggil dengan props yang benar.
          </p>
          <div className="mt-4 text-sm text-red-500">
            <p>Received props:</p>
            <ul className="text-left mt-2">
              <li>pdfId: {pdfId ? pdfId.toString() : 'undefined'}</li>
              <li>pdfPath: {pdfPath || 'undefined'}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {/* PDF Info Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiFile className="w-6 h-6 text-red-500" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">
                {title || `PDF Document ${actualPdfId || 'Unknown'}`}
              </h4>
              <p className="text-xs text-gray-500">
                {actualPdfId ? `ID: ${actualPdfId}` : 'File Path Mode'} • Siap untuk dilihat atau diunduh
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Tersedia
            </span>
            {downloadCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {downloadCount} unduhan
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {!showViewer ? (
              <button
                onClick={handleShowViewer}
                className="inline-flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <FiEye className="w-4 h-4 mr-2" />
                Lihat PDF
              </button>
            ) : (
              <button
                onClick={handleCloseViewer}
                className="inline-flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <FiMinimize className="w-4 h-4 mr-2" />
                Tutup Viewer
              </button>
            )}
            
            <button
              onClick={openInNewTab}
              className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              <FiExternalLink className="w-4 h-4 mr-2" />
              Tab Baru
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Unduh
            </button>

            {showEditButton && onEdit && actualPdfId && (
              <button
                onClick={onEdit}
                className="inline-flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <FiEdit className="w-4 h-4 mr-2" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Section */}
      {showViewer && (
        <div className="mt-4 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between bg-gray-50 p-3 rounded-lg gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white border rounded-md">
                <button
                  onClick={() => setScale(prev => Math.max(50, prev - 10))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  title="Perkecil"
                  disabled={loading}
                >
                  <FiZoomOut className="w-4 h-4" />
                </button>
                
                <span className="text-sm text-gray-700 px-3 py-2 min-w-[60px] text-center">
                  {scale}%
                </span>
                
                <button
                  onClick={() => setScale(prev => Math.min(200, prev + 10))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  title="Perbesar"
                  disabled={loading}
                >
                  <FiZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setScale(100)}
                className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 text-sm transition-colors"
                title="Reset zoom"
                disabled={loading}
              >
                Reset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={retryLoad}
                className="p-2 bg-white border rounded-md hover:bg-gray-50 transition-colors"
                title="Muat ulang PDF"
                disabled={loading}
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white border rounded-md hover:bg-gray-50 transition-colors"
                title={isFullscreen ? "Keluar fullscreen" : "Masuk fullscreen"}
              >
                {isFullscreen ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* PDF Content */}
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            {loading && (
              <div className="flex flex-col justify-center items-center h-96">
                <FiLoader className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                <span className="text-gray-600">Memuat PDF...</span>
                <p className="text-sm text-gray-500 mt-2">
                  {actualPdfId ? 'Mengunduh dari API...' : 'Memuat dari storage...'}
                </p>
              </div>
            )}

            {error && (
              <div className="flex flex-col justify-center items-center h-96 text-center p-6">
                <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Gagal Memuat PDF</h3>
                <p className="text-gray-600 mb-4 max-w-lg">
                  {error}
                </p>
                
                <div className="flex gap-2 justify-center flex-wrap">
                  <button 
                    onClick={retryLoad}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    Coba Lagi
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    Unduh Saja
                  </button>
                </div>
                
                <details className="mt-4 text-left bg-gray-100 p-3 rounded max-w-md">
                  <summary className="cursor-pointer text-sm text-gray-600 font-medium">
                    Detail Error
                  </summary>
                  <div className="mt-2 text-xs space-y-1">
                    <p><strong>PDF ID:</strong> {actualPdfId || 'N/A'}</p>
                    <p><strong>PDF Path:</strong> {pdfPath || 'N/A'}</p>
                    <p><strong>Endpoint:</strong> {downloadEndpoint}</p>
                    <p><strong>Error:</strong> {error}</p>
                  </div>
                </details>
              </div>
            )}

            {!loading && !error && pdfBlob && (
              <div className="relative" style={{ height: '600px' }}>
                <iframe
                  ref={iframeRef}
                  src={pdfBlob}
                  className="w-full h-full"
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
          <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded">
            <p>
              <strong>Mode:</strong> {actualPdfId ? `API Endpoint (/api/pdfs/${actualPdfId}/download)` : `Storage Path (${pdfPath})`} • 
              {actualPdfId ? 'Menggunakan autentikasi Bearer token' : 'Akses langsung ke storage'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}