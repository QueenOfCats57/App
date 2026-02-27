export interface Course {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  category: 'general' | 'business' | 'exam' | 'conversation';
  duration: number;
  price: number;
  students: number;
  rating: number;
  isPopular: boolean;
  isNew: boolean;
  hasDiscount: boolean;
  discountPrice?: number;
  startDate: Date;
  schedule: string[];
  teacher: {
    name: string;
    avatar: string;
    experience: number;
  };
  modules: string[];
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
export type CourseCategory = 'general' | 'business' | 'exam' | 'conversation';