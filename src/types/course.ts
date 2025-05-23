// Course related types for instructor dashboard

export interface Instructor {
  id: number;
  name: string;
  email?: string;
}

export interface Category {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface PdfItem {
  id: number;
  title: string;
  file_path: string;
  order_index: number;
  course_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  is_published: boolean;
  instructor_id: number;
  instructor: Instructor;
  categories: Category[];
  pdfs: PdfItem[];
  created_at: string;
  updated_at: string;
}

export interface PdfFile {
  id?: number;
  title: string;
  file: File | null;
  order_index: number;
  file_path?: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  price: string;
  thumbnail: File | null;
  is_published: boolean;
  category_ids: number[];
}

export interface CourseFormProps {
  mode: 'create' | 'edit';
  courseId?: number;
  initialData?: Course;
}

export interface PdfUploadProps {
  pdfFiles: PdfFile[];
  setPdfFiles: React.Dispatch<React.SetStateAction<PdfFile[]>>;
  mode: 'create' | 'edit';
  courseId?: number;
}

export interface PdfListProps {
  pdfs: PdfItem[];
  onUpdate: () => void;
}

export interface CourseCardProps {
  course: Course;
  index: number;
  onDelete: (courseId: number) => void;
  onTogglePublish: (courseId: number, currentStatus: boolean) => void;
}

// API Response types
export interface ApiResponse<T> {
  message: string;
  data: T;
  success?: boolean;
  errors?: Record<string, string[]>;
}

export interface CourseListResponse extends ApiResponse<Course[]> {}
export interface CourseResponse extends ApiResponse<Course> {}
export interface CategoryListResponse extends ApiResponse<Category[]> {}

// Form validation types
export interface ValidationErrors {
  title?: string[];
  description?: string[];
  price?: string[];
  thumbnail?: string[];
  category_ids?: string[];
}

// File upload types
export interface FileUploadResponse {
  success: boolean;
  message: string;
  file_path?: string;
  errors?: string[];
}

// PDF management types
export interface PdfUploadData {
  title: string;
  file: File;
  order_index: number;
}

export interface PdfUpdateData {
  title?: string;
  order_index?: number;
  file?: File;
}