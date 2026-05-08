import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, delay, catchError, tap } from 'rxjs/operators';
import { Course, CourseFilter, CourseLevel, CourseCategory } from '../services/course.model';

@Injectable({
  providedIn: 'root' // Сервис доступен во всем приложении
})
export class CourseService {
  // BehaviorSubject для хранения и реактивного обновления данных
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();
  
  // Кэш для фильтрованных курсов
  private filteredCoursesCache = new Map<string, Course[]>();
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeCourses();
  }
  
  /**
   * Инициализация данных о курсах
   * Имитация загрузки с сервера
   */
  private initializeCourses(): void {
    this.loadingSubject.next(true);
    
    // Имитация асинхронной загрузки
    setTimeout(() => {
      const courses = this.getMockCourses();
      this.coursesSubject.next(courses);
      this.loadingSubject.next(false);
    }, 500);
  }
  
  /**
   * Получение всех курсов
   */
  getAllCourses(): Observable<Course[]> {
    return this.courses$.pipe(
      tap(courses => {
        console.log(`📚 Сервис: Получено ${courses.length} курсов`);
      }),
      catchError(error => {
        this.errorSubject.next('Ошибка при загрузке курсов');
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Получение курса по ID
   */
  getCourseById(id: number): Observable<Course | undefined> {
    return this.courses$.pipe(
      map(courses => courses.find(course => course.id === id)),
      tap(course => {
        if (course) {
          console.log(`Сервис: Найден курс "${course.title}"`);
        } else {
          console.warn(`Сервис: Курс с ID ${id} не найден`);
        }
      })
    );
  }
  
  /**
   * Фильтрация курсов
   */
  getFilteredCourses(filter: CourseFilter): Observable<Course[]> {
    this.loadingSubject.next(true);
    
    // Создаем ключ кэша на основе фильтра
    const cacheKey = JSON.stringify(filter);
    
    // Проверяем кэш
    if (this.filteredCoursesCache.has(cacheKey)) {
      console.log('Сервис: Используем кэшированные данные');
      this.loadingSubject.next(false);
      return of(this.filteredCoursesCache.get(cacheKey)!);
    }
    
    return this.courses$.pipe(
      map(courses => {
        let filtered = [...courses];
        
        // Фильтр по уровню
        if (filter.level && filter.level !== 'all') {
          filtered = filtered.filter(course => course.level === filter.level);
        }
        
        // Фильтр по категории
        if (filter.category && filter.category !== 'all') {
          filtered = filtered.filter(course => course.category === filter.category);
        }
        
        // Фильтр популярных
        if (filter.showOnlyPopular) {
          filtered = filtered.filter(course => course.isPopular);
        }
        
        // Фильтр новых
        if (filter.showOnlyNew) {
          filtered = filtered.filter(course => course.isNew);
        }
        
        // Поиск по тексту
        if (filter.searchQuery && filter.searchQuery.trim()) {
          const query = filter.searchQuery.toLowerCase().trim();
          filtered = filtered.filter(course =>
            course.title.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.teacher.name.toLowerCase().includes(query)
          );
        }
        
        // Сортировка
        if (filter.sortBy) {
          filtered.sort((a, b) => {
            let comparison = 0;
            switch (filter.sortBy) {
              case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
              case 'price':
                const priceA = a.discountPrice || a.price;
                const priceB = b.discountPrice || b.price;
                comparison = priceA - priceB;
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
            return filter.sortDirection === 'asc' ? comparison : -comparison;
          });
        }
        
        // Сохраняем в кэш
        this.filteredCoursesCache.set(cacheKey, filtered);
        
        console.log(`Сервис: Отфильтровано ${filtered.length} курсов из ${courses.length}`);
        return filtered;
      }),
      tap(() => this.loadingSubject.next(false)),
      delay(300), // Имитация задержки сети
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Ошибка при фильтрации курсов');
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Добавление нового курса
   */
  addCourse(course: Omit<Course, 'id'>): Observable<Course> {
    this.loadingSubject.next(true);
    
    return this.courses$.pipe(
      map(courses => {
        const newId = Math.max(...courses.map(c => c.id), 0) + 1;
        const newCourse: Course = {
          ...course,
          id: newId,
          startDate: new Date(course.startDate)
        };
        
        const updatedCourses = [...courses, newCourse];
        this.coursesSubject.next(updatedCourses);
        this.clearCache();
        
        console.log(`Сервис: Добавлен новый курс "${newCourse.title}" с ID ${newId}`);
        return newCourse;
      }),
      tap(() => this.loadingSubject.next(false)),
      delay(500),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Ошибка при добавлении курса');
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Обновление курса
   */
  updateCourse(id: number, updates: Partial<Course>): Observable<Course> {
    this.loadingSubject.next(true);
    
    return this.courses$.pipe(
      map(courses => {
        const index = courses.findIndex(c => c.id === id);
        if (index === -1) {
          throw new Error(`Курс с ID ${id} не найден`);
        }
        
        const updatedCourse = { ...courses[index], ...updates };
        const updatedCourses = [...courses];
        updatedCourses[index] = updatedCourse;
        
        this.coursesSubject.next(updatedCourses);
        this.clearCache();
        
        console.log(`Сервис: Обновлен курс "${updatedCourse.title}"`);
        return updatedCourse;
      }),
      tap(() => this.loadingSubject.next(false)),
      delay(500),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Ошибка при обновлении курса');
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Удаление курса
   */
  deleteCourse(id: number): Observable<boolean> {
    this.loadingSubject.next(true);
    
    return this.courses$.pipe(
      map(courses => {
        const courseToDelete = courses.find(c => c.id === id);
        if (!courseToDelete) {
          throw new Error(`Курс с ID ${id} не найден`);
        }
        
        const updatedCourses = courses.filter(c => c.id !== id);
        this.coursesSubject.next(updatedCourses);
        this.clearCache();
        
        console.log(`Сервис: Удален курс "${courseToDelete.title}"`);
        return true;
      }),
      tap(() => this.loadingSubject.next(false)),
      delay(500),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Ошибка при удалении курса');
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Получение статистики по курсам
   */
  getStatistics(): Observable<{
    totalCourses: number;
    averageRating: number;
    totalStudents: number;
    popularCount: number;
    newCount: number;
    discountCount: number;
  }> {
    return this.courses$.pipe(
      map(courses => {
        const totalCourses = courses.length;
        const averageRating = totalCourses > 0
          ? Number((courses.reduce((sum, c) => sum + c.rating, 0) / totalCourses).toFixed(1))
          : 0;
        const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
        const popularCount = courses.filter(c => c.isPopular).length;
        const newCount = courses.filter(c => c.isNew).length;
        const discountCount = courses.filter(c => c.hasDiscount).length;
        
        return {
          totalCourses,
          averageRating,
          totalStudents,
          popularCount,
          newCount,
          discountCount
        };
      })
    );
  }
  
  /**
   * Получение уникальных уровней курсов
   */
  getUniqueLevels(): Observable<CourseLevel[]> {
    return this.courses$.pipe(
      map(courses => {
        const levels = new Set(courses.map(c => c.level));
        return Array.from(levels) as CourseLevel[];
      })
    );
  }
  
  /**
   * Получение уникальных категорий курсов
   */
  getUniqueCategories(): Observable<CourseCategory[]> {
    return this.courses$.pipe(
      map(courses => {
        const categories = new Set(courses.map(c => c.category));
        return Array.from(categories) as CourseCategory[];
      })
    );
  }
  
  /**
   * Очистка кэша
   */
  private clearCache(): void {
    this.filteredCoursesCache.clear();
    console.log('Сервис: Кэш очищен');
  }
  
  /**
   * Сброс ошибки
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
  
  /**
   * Тестовые данные (mock)
   */
  private getMockCourses(): Course[] {
    return [
      {
        id: 1,
        title: 'Английский для начинающих',
        description: 'Идеальный старт в мир английского языка. Освойте базовую грамматику, научитесь представляться, делать заказ в кафе и спрашивать дорогу.',
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
        description: 'Преодолейте языковой барьер! Живое общение на актуальные темы с носителями языка и другими студентами.',
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
        description: 'Интенсивная подготовка к международному экзамену. Все секции экзамена, стратегии выполнения заданий, пробные тесты с разбором.',
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
        description: 'Деловой английский для профессионалов. Научитесь проводить презентации, вести переговоры, писать деловые письма.',
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
        description: 'Увлекательные уроки для детей 7-12 лет. Игровая форма обучения, песни, мультфильмы и интерактивные задания.',
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
        description: 'Специализированный курс для программистов и IT-специалистов. Техническая лексика, чтение документации, общение на митапах.',
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
        description: 'Практический курс для тех, кто любит путешествовать. Бронирование отелей, заказ еды, общение в аэропорту.',
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
        description: 'Для студентов и исследователей. Написание эссе, академических статей, подготовка презентаций для конференций.',
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
}