import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Course {
  id: number;
  instructor_id: number;
  title: string;
  description?: string;
  price: string;
  thumbnail?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  instructor?: {
    id: number;
    name: string;
    email: string;
  };
  categories?: Array<{
    id: number;
    name: string;
    pivot: {
      course_id: number;
      category_id: number;
    };
  }>;
  pdfs?: Array<{
    id: number;
    course_id: number;
    title: string;
    file_path: string;
    order_index: number;
    created_at: string;
    updated_at: string;
  }>;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseData {
  title: string;
  description?: string;
  price: number;
  thumbnail?: string;
  is_published: boolean;
  category_ids?: number[];
}

export interface PdfUploadData {
  title: string;
  file: File;
  order_index?: number;
}

// Get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/json",
  };
};

// Course API functions
export const courseAPI = {
  // Get all courses
  async getCourses(published?: boolean): Promise<Course[]> {
    try {
      const url = new URL(`${API_BASE_URL}/courses`);
      if (published !== undefined) {
        url.searchParams.append('published', published.toString());
      }

      const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Gagal mengambil data course');
      throw error;
    }
  },

  // Get single course
  async getCourse(id: number): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Gagal mengambil detail course');
      throw error;
    }
  },

  // Create course
  async createCourse(courseData: CreateCourseData): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }

      const data = await response.json();
      toast.success('Course berhasil dibuat');
      return data.data;
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Gagal membuat course');
      throw error;
    }
  },

  // Update course
  async updateCourse(id: number, courseData: CreateCourseData): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update course');
      }

      const data = await response.json();
      toast.success('Course berhasil diperbarui');
      return data.data;
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Gagal memperbarui course');
      throw error;
    }
  },

  // Delete course
  async deleteCourse(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete course');
      }

      toast.success('Course berhasil dihapus');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Gagal menghapus course');
      throw error;
    }
  },

  // Upload PDF
  async uploadPdf(courseId: number, pdfs: PdfUploadData[]): Promise<any> {
    try {
      const formData = new FormData();
      
      pdfs.forEach((pdf, index) => {
        formData.append(`pdfs[${index}][title]`, pdf.title);
        formData.append(`pdfs[${index}][file]`, pdf.file);
        formData.append(`pdfs[${index}][order_index]`, (pdf.order_index || 0).toString());
      });

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/upload`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Accept": "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload PDF');
      }

      const data = await response.json();
      toast.success('PDF berhasil diupload');
      return data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Gagal mengupload PDF');
      throw error;
    }
  },

  // Delete PDF
  async deletePdf(pdfId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/pdfs/${pdfId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete PDF');
      }

      toast.success('PDF berhasil dihapus');
    } catch (error) {
      console.error('Error deleting PDF:', error);
      toast.error('Gagal menghapus PDF');
      throw error;
    }
  },

  // Download PDF
  async downloadPdf(pdfId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/pdfs/${pdfId}/download`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Gagal mendownload PDF');
      throw error;
    }
  },
};

// Category API functions
export const categoryAPI = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Gagal mengambil data kategori');
      throw error;
    }
  },
};