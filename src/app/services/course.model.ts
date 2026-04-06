export interface Teacher {
  name: string;
  avatar: string;
  experience: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  category: 'general' | 'business' | 'exam' | 'conversation';
  duration: number; // в неделях
  price: number;
  students: number;
  rating: number;
  isPopular: boolean;
  isNew: boolean;
  hasDiscount: boolean;
  discountPrice?: number;
  startDate: Date;
  schedule: string[];
  teacher: Teacher;
  modules: string[];
  imageUrl?: string;
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
export type CourseCategory = 'general' | 'business' | 'exam' | 'conversation';

export interface CourseFilter {
  level?: CourseLevel | 'all';
  category?: CourseCategory | 'all';
  searchQuery?: string;
  showOnlyPopular?: boolean;
  showOnlyNew?: boolean;
  sortBy?: 'title' | 'price' | 'rating' | 'students' | 'duration';
  sortDirection?: 'asc' | 'desc';
}