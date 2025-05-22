// app/instruktur/course/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  is_published: boolean;
  categories: Category[];
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const { data } = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 ml-64"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Kelola Kursus</h1>
        <Link
          href="/instruktur/course/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Buat Kursus Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <div className="mb-4">
              {course.categories.map((category) => (
                <span 
                  key={category.id}
                  className="inline-block mr-2 mb-2 px-2 py-1 bg-gray-100 text-sm rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm ${
                course.is_published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {course.is_published ? 'Published' : 'Draft'}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/instruktur/course/${course.id}/pdfs`}
                  className="flex items-center bg-gray-100 px-3 py-2 rounded-md gap-2"
                >
                  <DocumentArrowUpIcon className="w-5 h-5" />
                  PDF
                </Link>
                <Link
                  href={`/instruktur/course/edit/${course.id}`}
                  className="bg-blue-100 text-blue-600 px-3 py-2 rounded-md"
                >
                  Edit
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}