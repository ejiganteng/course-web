'use client';

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiRotateCw, FiDownload } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import react-pdf components to avoid SSR issues
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  import('react-pdf').then(({ pdfjs }) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  });
}

interface PdfViewerProps {
  pdfPath: string;
  title?: string;
}

export default function PdfViewer({ pdfPath, title }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert storage path to accessible URL
  // Backend menyimpan sebagai 'public/course_pdfs/filename.pdf'
  // Web access harus 'storage/course_pdfs/filename.pdf'
  const pdfUrl = (() => {
    // Remove 'public/' prefix and replace with 'storage/'
    const storagePath = pdfPath.replace('public/', 'storage/');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
    return `${baseUrl}/${storagePath}`;
  })();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    console.log('PDF loaded successfully, pages:', numPages);
  }

  function onDocumentLoadError(error: Error) {
    setLoading(false);
    setError('Gagal memuat PDF. Pastikan file PDF valid dan dapat diakses.');
    console.error('PDF load error:', error);
    console.error('PDF URL attempted:', pdfUrl);
  }

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3.0, prev + 0.2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.2));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetView = () => {
    setScale(1.0);
    setRotation(0);
    setPageNumber(1);
  };

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title || 'document'}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPdfInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  // Don't render anything on server-side
  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Memuat komponen PDF...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="mt-3 text-gray-600">Memuat PDF...</span>
        <p className="text-xs text-gray-400 mt-2">URL: {pdfUrl}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Memuat PDF</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="space-y-2">
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
              }} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
            <button 
              onClick={openPdfInNewTab}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Buka di Tab Baru
            </button>
            <button 
              onClick={downloadPdf}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              Download
            </button>
          </div>
          <details className="text-left bg-gray-100 p-3 rounded mt-4">
            <summary className="cursor-pointer text-sm text-gray-600">Debug Info</summary>
            <div className="mt-2 text-xs space-y-1">
              <p><strong>Original Path:</strong> {pdfPath}</p>
              <p><strong>Generated URL:</strong> {pdfUrl}</p>
              <p><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}</p>
            </div>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between bg-gray-100 p-4 rounded-lg mb-4 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Halaman sebelumnya"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-700 px-3 py-2 bg-white border rounded-lg">
            {pageNumber} / {numPages}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="p-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Halaman selanjutnya"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            title="Zoom out"
          >
            <FiZoomOut className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-700 px-3 py-2 bg-white border rounded-lg min-w-[80px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <button
            onClick={zoomIn}
            className="p-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            title="Zoom in"
          >
            <FiZoomIn className="w-4 h-4" />
          </button>
          
          <button
            onClick={rotate}
            className="p-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            title="Putar"
          >
            <FiRotateCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={resetView}
            className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm transition-colors"
            title="Reset view"
          >
            Reset
          </button>

          <button
            onClick={openPdfInNewTab}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            title="Buka di tab baru"
          >
            Tab Baru
          </button>

          <button
            onClick={downloadPdf}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-1"
            title="Download PDF"
          >
            <FiDownload className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="border border-gray-300 rounded-lg overflow-auto bg-white pdf-container" style={{ height: '600px' }}>
        <div className="flex justify-center p-4">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Memuat dokumen...</span>
              </div>
            }
            error={
              <div className="text-center py-8">
                <p className="text-red-600 mb-2">Gagal memuat PDF</p>
                <p className="text-sm text-gray-500">URL: {pdfUrl}</p>
                <button 
                  onClick={openPdfInNewTab}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Coba buka di tab baru
                </button>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              loading={
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-gray-600">Memuat halaman...</span>
                </div>
              }
              error={
                <div className="text-center py-8">
                  <p className="text-red-600">Gagal memuat halaman</p>
                </div>
              }
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      </div>

      {/* Page Navigation */}
      {numPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber(1)}
              disabled={pageNumber === 1}
              className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Pertama
            </button>
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Halaman {pageNumber} dari {numPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </button>
            <button
              onClick={() => setPageNumber(numPages)}
              disabled={pageNumber === numPages}
              className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Terakhir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}