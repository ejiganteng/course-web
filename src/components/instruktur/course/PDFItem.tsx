'use client';
import { motion } from 'framer-motion';
import { TrashIcon, DocumentArrowDownIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function PDFItem({ pdf, courseId }: { pdf: any; courseId: string }) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pdfs/${pdf.id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) {
        toast.success('PDF berhasil dihapus');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Gagal menghapus PDF');
    }
  };

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
    >
      <div>
        <h3 className="font-medium">{pdf.title}</h3>
        <p className="text-sm text-gray-500">Urutan: {pdf.order_index}</p>
      </div>

      <div className="flex gap-2">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/pdfs/${pdf.id}/download`}
          className="p-2 hover:bg-gray-100 rounded-md"
          download
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
        </a>
        <button className="p-2 hover:bg-blue-100 rounded-md">
          <PencilSquareIcon className="w-5 h-5 text-blue-600" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 hover:bg-red-100 rounded-md"
        >
          <TrashIcon className="w-5 h-5 text-red-600" />
        </button>
      </div>
    </motion.div>
  );
}