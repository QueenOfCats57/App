import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Course, CourseLevel, CourseCategory } from '../../pages/course-list/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.scss']
})
export class CourseList implements OnInit {
  // Массив с данными о курсах
  courses: Course[] = [];
  
  // Для демонстрации ngSwitch
  selectedViewMode: 'grid' | 'list' | 'compact' = 'grid';
  
  // Для фильтрации (демонстрация ngIf)
  selectedLevel: CourseLevel | 'all' = 'all';
  selectedCategory: CourseCategory | 'all' = 'all';
  showOnlyPopular: boolean = false;
  showOnlyNew: boolean = false;
  
  // Для поиска
  searchQuery: string = '';
  
  // Для сортировки
  sortBy: 'title' | 'price' | 'rating' | 'students' | 'duration' = 'rating';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Для демонстрации ngClass и ngStyle
  highlightedCourseId: number | null = null;
  isFiltersVisible: boolean = true;
  
  // Статистика для демонстрации
  totalCourses: number = 0;
  averageRating: number = 0;
  totalStudents: number = 0;

  ngOnInit() {
    this.initializeCourses();
    this.calculateStats();
  }

  private initializeCourses() {
    this.courses = [
      {
        id: 1,
        title: 'Английский для начинающих',
        description: 'Идеальный старт в мир английского языка. Освойте базовую грамматику, научитесь представляться, делать заказ в кафе и спрашивать дорогу. Интерактивные упражнения и разговорная практика с первых занятий.',
        level: 'beginner',
        category: 'general',
        duration: 8,
        price: 15000,
        students: 1234,
        rating: 4.8,
        isPopular: true,
        isNew: false,
        hasDiscount: true,
        discountPrice: 12000,
        startDate: new Date('2024-04-01'),
        schedule: ['Пн', 'Ср', 'Пт', '10:00-11:30'],
        teacher: {
          name: 'Анна Смирнова',
          avatar: '👩‍🏫',
          experience: 8
        },
        modules: ['Алфавит и произношение', 'Базовые фразы', 'Числа и время', 'Еда и напитки', 'Путешествия']
      },
      {
        id: 2,
        title: 'Разговорный клуб',
        description: 'Преодолейте языковой барьер! Живое общение на актуальные темы с носителями языка и другими студентами. Каждую неделю новые темы: от путешествий до технологий.',
        level: 'intermediate',
        category: 'conversation',
        duration: 12,
        price: 18000,
        students: 856,
        rating: 4.9,
        isPopular: true,
        isNew: false,
        hasDiscount: false,
        startDate: new Date('2024-03-15'),
        schedule: ['Вт', 'Чт', '19:00-20:30'],
        teacher: {
          name: 'Mark Johnson',
          avatar: '👨‍🏫',
          experience: 12
        },
        modules: ['Travel', 'Technology', 'Arts & Culture', 'Business Trends', 'Environmental Issues']
      },
      {
        id: 3,
        title: 'Подготовка к IELTS',
        description: 'Интенсивная подготовка к международному экзамену. Все секции экзамена, стратегии выполнения заданий, пробные тесты с разбором. Гарантированное повышение балла.',
        level: 'advanced',
        category: 'exam',
        duration: 16,
        price: 25000,
        students: 567,
        rating: 4.9,
        isPopular: true,
        isNew: false,
        hasDiscount: true,
        discountPrice: 22000,
        startDate: new Date('2024-04-10'),
        schedule: ['Пн', 'Ср', '18:00-20:00'],
        teacher: {
          name: 'Елена Петрова',
          avatar: '👩‍🎓',
          experience: 10
        },
        modules: ['Listening strategies', 'Reading techniques', 'Writing task 1 & 2', 'Speaking part 1-3', 'Mock tests']
      },
      {
        id: 4,
        title: 'Бизнес-английский',
        description: 'Деловой английский для профессионалов. Научитесь проводить презентации, вести переговоры, писать деловые письма и чувствовать себя уверенно в международной среде.',
        level: 'intermediate',
        category: 'business',
        duration: 10,
        price: 20000,
        students: 432,
        rating: 4.7,
        isPopular: false,
        isNew: true,
        hasDiscount: true,
        discountPrice: 17500,
        startDate: new Date('2024-03-20'),
        schedule: ['Вт', 'Чт', 'Сб', '11:00-12:30'],
        teacher: {
          name: 'Дмитрий Волков',
          avatar: '👨‍💼',
          experience: 15
        },
        modules: ['Business correspondence', 'Presentations', 'Negotiations', 'Meetings', 'Small talk']
      },
      {
        id: 5,
        title: 'Английский для детей',
        description: 'Увлекательные уроки для детей 7-12 лет. Игровая форма обучения, песни, мультфильмы и интерактивные задания. Привьем любовь к языку с детства.',
        level: 'beginner',
        category: 'general',
        duration: 16,
        price: 14000,
        students: 789,
        rating: 4.9,
        isPopular: true,
        isNew: false,
        hasDiscount: false,
        startDate: new Date('2024-04-05'),
        schedule: ['Сб', 'Вс', '12:00-13:30'],
        teacher: {
          name: 'Мария Иванова',
          avatar: '👩‍🏫',
          experience: 7
        },
        modules: ['Alphabet', 'Colors & Numbers', 'Family & Friends', 'Animals', 'Toys & Games']
      },
      {
        id: 6,
        title: 'Английский для IT',
        description: 'Специализированный курс для программистов и IT-специалистов. Техническая лексика, чтение документации, общение на митапах и собеседованиях.',
        level: 'intermediate',
        category: 'business',
        duration: 8,
        price: 19000,
        students: 345,
        rating: 4.8,
        isPopular: false,
        isNew: true,
        hasDiscount: true,
        discountPrice: 16500,
        startDate: new Date('2024-03-25'),
        schedule: ['Пн', 'Ср', '20:00-21:30'],
        teacher: {
          name: 'Alex Chen',
          avatar: '👨‍💻',
          experience: 9
        },
        modules: ['Technical terminology', 'Code reviews', 'Tech presentations', 'Job interviews', 'Tech documentation']
      },
      {
        id: 7,
        title: 'Английский для путешествий',
        description: 'Практический курс для тех, кто любит путешествовать. Бронирование отелей, заказ еды, общение в аэропорту, решение проблем в поездках.',
        level: 'beginner',
        category: 'conversation',
        duration: 6,
        price: 12000,
        students: 654,
        rating: 4.7,
        isPopular: false,
        isNew: false,
        hasDiscount: true,
        discountPrice: 10000,
        startDate: new Date('2024-04-15'),
        schedule: ['Ср', 'Пт', '18:00-19:30'],
        teacher: {
          name: 'София Ким',
          avatar: '🧳',
          experience: 6
        },
        modules: ['At the airport', 'Hotel reservation', 'Restaurant', 'Shopping', 'Emergencies']
      },
      {
        id: 8,
        title: 'Академический английский',
        description: 'Для студентов и исследователей. Написание эссе, академических статей, подготовка презентаций для конференций, академическое общение.',
        level: 'advanced',
        category: 'exam',
        duration: 12,
        price: 22000,
        students: 234,
        rating: 4.8,
        isPopular: false,
        isNew: true,
        hasDiscount: false,
        startDate: new Date('2024-04-20'),
        schedule: ['Вт', 'Чт', '17:00-18:30'],
        teacher: {
          name: 'Prof. James Wilson',
          avatar: '👨‍🎓',
          experience: 20
        },
        modules: ['Academic writing', 'Research papers', 'Presentations', 'Academic discussions', 'Citations']
      }
    ];
  }

  // Вычисление статистики
  private calculateStats() {
    this.totalCourses = this.courses.length;
    this.averageRating = Number((this.courses.reduce((sum, c) => sum + c.rating, 0) / this.totalCourses).toFixed(1));
    this.totalStudents = this.courses.reduce((sum, c) => sum + c.students, 0);
  }

  // Фильтрация курсов (демонстрация ngIf)
  get filteredCourses(): Course[] {
    return this.courses.filter(course => {
      // Фильтр по уровню
      if (this.selectedLevel !== 'all' && course.level !== this.selectedLevel) {
        return false;
      }
      
      // Фильтр по категории
      if (this.selectedCategory !== 'all' && course.category !== this.selectedCategory) {
        return false;
      }
      
      // Фильтр популярных
      if (this.showOnlyPopular && !course.isPopular) {
        return false;
      }
      
      // Фильтр новых
      if (this.showOnlyNew && !course.isNew) {
        return false;
      }
      
      // Поиск по названию и описанию
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return course.title.toLowerCase().includes(query) || 
               course.description.toLowerCase().includes(query) ||
               course.teacher.name.toLowerCase().includes(query);
      }
      
      return true;
    }).sort((a, b) => {
      // Сортировка
      let comparison = 0;
      switch (this.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          comparison = (a.discountPrice || a.price) - (b.discountPrice || b.price);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'students':
          comparison = a.students - b.students;
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // Методы для демонстрации директив
  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  highlightCourse(courseId: number | null) {
    this.highlightedCourseId = courseId;
  }

  getCourseLevelLabel(level: CourseLevel): string {
    const labels = {
      'beginner': 'Начинающий',
      'intermediate': 'Средний',
      'advanced': 'Продвинутый',
      'all-levels': 'Все уровни'
    };
    return labels[level];
  }

  getCourseLevelClass(level: CourseLevel): string {
    const classes = {
      'beginner': 'level-beginner',
      'intermediate': 'level-intermediate',
      'advanced': 'level-advanced',
      'all-levels': 'level-all'
    };
    return classes[level];
  }

  getCategoryIcon(category: CourseCategory): string {
    const icons = {
      'general': '📚',
      'business': '💼',
      'exam': '📝',
      'conversation': '💬'
    };
    return icons[category];
  }

  getCategoryLabel(category: CourseCategory): string {
    const labels = {
      'general': 'Общий',
      'business': 'Бизнес',
      'exam': 'Экзамен',
      'conversation': 'Разговорный'
    };
    return labels[category];
  }

  // Для ngStyle
  getCourseCardStyle(course: Course): any {
    return {
      'border-left': this.highlightedCourseId === course.id ? '5px solid #f06292' : 'none',
      'transform': this.highlightedCourseId === course.id ? 'scale(1.02)' : 'scale(1)',
      'box-shadow': this.highlightedCourseId === course.id ? '0 10px 30px rgba(240, 98, 146, 0.3)' : 'none',
      'transition': 'all 0.3s ease'
    };
  }

  // Для ngClass
  getCourseCardClasses(course: Course): any {
    return {
      'popular-course': course.isPopular,
      'new-course': course.isNew,
      'discount-course': course.hasDiscount,
      'highlighted': this.highlightedCourseId === course.id
    };
  }

  getPriceWithDiscount(course: Course): number {
    return course.discountPrice || course.price;
  }

  // Сброс фильтров
  resetFilters() {
    this.selectedLevel = 'all';
    this.selectedCategory = 'all';
    this.showOnlyPopular = false;
    this.showOnlyNew = false;
    this.searchQuery = '';
    this.sortBy = 'rating';
    this.sortDirection = 'desc';
  }
}