'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  EyeSlashIcon,
  DocumentTextIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  is_published: boolean;
  instructor: {
    id: number;
    name: string;
  };
  categories: Array<{
    id: number;
    name: string;
  }>;
  pdfs: Array<{
    id: number;
    title: string;
    file_path: string;
    order_index: number;
  }>;
  created_at: string;
  updated_at: string;
}

interface CourseCardProps {
  course: Course;
  index: number;
  onDelete: (courseId: number) => void;
  onTogglePublish: (courseId: number, currentStatus: boolean) => void;
}

export default function CourseCard({ 
  course, 
  index, 
  onDelete, 
  onTogglePublish 
}: CourseCardProps) {
  const cardAnimation = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        delay: index * 0.1,
      },
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getThumbnailUrl = (thumbnail: string) => {
    if (!thumbnail) return `data:image/svg+xml;base64,${btoa('<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">No Image</text></svg>')}`; 
    if (thumbnail.startsWith('http')) return thumbnail;
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${thumbnail}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = `data:image/svg+xml;base64,${btoa('<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">Image Error</text></svg>')}`;
  };

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="visible"
      exit="hidden"
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getThumbnailUrl(course.thumbnail)}
          alt={course.title}
          className="w-full h-full object-cover absolute inset-0"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            course.is_published 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {course.is_published ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold flex items-center gap-1">
            <CurrencyDollarIcon className="w-3 h-3" />
            {formatPrice(course.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description || 'Tidak ada deskripsi'}
        </p>

        {/* Categories */}
        {course.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {course.categories.slice(0, 2).map((category) => (
              <span 
                key={category.id}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {category.name}
              </span>
            ))}
            {course.categories.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{course.categories.length - 2} lagi
              </span>
            )}
          </div>
        )}

        {/* PDF Count */}
        <div className="flex items-center gap-1 mb-4 text-sm text-gray-500">
          <DocumentTextIcon className="w-4 h-4" />
          <span>{course.pdfs.length} Materi PDF</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/instruktur/course/${course.id}/edit`}
            className="flex-1"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTogglePublish(course.id, course.is_published)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              course.is_published
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {course.is_published ? (
              <>
                <EyeSlashIcon className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <EyeIcon className="w-4 h-4" />
                Publish
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDelete(course.id)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}