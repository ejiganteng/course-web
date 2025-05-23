'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { protectedFetch } from '@/utils/auth-utils';
import CourseCard from './CourseCard';

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

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await protectedFetch('/courses');
      
      if (response.ok) {
        const data = await response.json();
        // Filter hanya course milik instruktur yang sedang login
        const instructorId = parseInt(localStorage.getItem('user_id') || '0');
        const instructorCourses = data.data.filter(
          (course: Course) => course.instructor.id === instructorId
        );
        setCourses(instructorCourses);
      } else {
        throw new Error('Gagal mengambil data course');
      }
    } catch (error) {
      toast.error('Gagal memuat daftar course');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus course ini?')) return;

    try {
      const response = await protectedFetch(`/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Course berhasil dihapus');
        setCourses(courses.filter(course => course.id !== courseId));
      } else {
        throw new Error('Gagal menghapus course');
      }
    } catch (error) {
      toast.error('Gagal menghapus course');
      console.error('Error deleting course:', error);
    }
  };

  const handleTogglePublish = async (courseId: number, currentStatus: boolean) => {
    try {
      console.log('Toggling publish status:', { courseId, currentStatus, newStatus: !currentStatus });
      
      // Try different approaches for toggle request
      let response;
      const newStatus = !currentStatus;
      
      // Approach 1: Simple JSON request (try this first)
      try {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            is_published: newStatus
          }),
        });
      } catch (error) {
        console.log('JSON approach failed, trying FormData approach...');
        
        // Approach 2: FormData request (fallback)
        const formData = new FormData();
        formData.append('is_published', newStatus ? '1' : '0');
        
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
      }

      console.log('Toggle response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Toggle response data:', data);
        
        toast.success(`Course berhasil ${newStatus ? 'dipublish' : 'di-unpublish'}`);
        setCourses(courses.map(course => 
          course.id === courseId 
            ? { ...course, is_published: newStatus }
            : course
        ));
      } else {
        const errorData = await response.json();
        console.error('Toggle error response:', errorData);
        
        // Handle specific error cases
        if (response.status === 422) {
          // Validation error - try with minimal course data
          console.log('Validation failed, trying with current course data...');
          const currentCourse = courses.find(c => c.id === courseId);
          if (currentCourse) {
            const fullUpdateData = {
              title: currentCourse.title,
              description: currentCourse.description,
              price: currentCourse.price,
              is_published: newStatus,
              category_ids: currentCourse.categories.map(cat => cat.id)
            };
            
            const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify(fullUpdateData),
            });
            
            if (retryResponse.ok) {
              toast.success(`Course berhasil ${newStatus ? 'dipublish' : 'di-unpublish'}`);
              setCourses(courses.map(course => 
                course.id === courseId 
                  ? { ...course, is_published: newStatus }
                  : course
              ));
              return;
            }
          }
        }
        
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join(', ');
          throw new Error(`Validasi gagal: ${errorMessages}`);
        }
        
        throw new Error(errorData.message || 'Gagal mengubah status publikasi');
      }
    } catch (error) {
      console.error('Toggle publish error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengubah status publikasi';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-lg shadow-md"
      >
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Belum Ada Course
        </h3>
        <p className="text-gray-500">
          Mulai membuat course pertama Anda untuk berbagi pengetahuan
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {courses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            index={index}
            onDelete={handleDeleteCourse}
            onTogglePublish={handleTogglePublish}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}