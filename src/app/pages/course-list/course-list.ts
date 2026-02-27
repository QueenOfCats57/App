import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, ElementRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Course } from '../../pages/course-list/course.model';
import { CourseCardComponent } from '../../pages/course-card/course-card';
import { CourseFilterComponent } from '../../pages/course-filter/course-filter';
import { CourseStatisticsComponent } from '../../pages/course-statistics/course-statistics';
import { FilterSectionComponent } from '../../pages/filter-section/filter-section';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    CourseCardComponent,
    CourseFilterComponent,
    CourseStatisticsComponent,
    FilterSectionComponent
  ],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.scss']
})
export class CourseList implements OnInit, AfterViewInit {
  // Данные о курсах
  courses: Course[] = [];
  
  // Состояние фильтров
  selectedLevel: 'all' | 'beginner' | 'intermediate' | 'advanced' = 'all';
  selectedCategory: 'all' | 'general' | 'business' | 'exam' | 'conversation' = 'all';
  showOnlyPopular: boolean = false;
  showOnlyNew: boolean = false;
  searchQuery: string = '';
  sortBy: 'title' | 'price' | 'rating' | 'students' | 'duration' = 'rating';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Режим отображения
  selectedViewMode: 'grid' | 'list' | 'compact' = 'grid';
  
  // Состояние UI
  isFiltersVisible: boolean = true;
  highlightedCourseId: number | null = null;
  
  // Статистика
  totalCourses: number = 0;
  averageRating: number = 0;
  totalStudents: number = 0;
  
  // ViewChild для доступа к дочерним компонентам
  @ViewChild(CourseStatisticsComponent) statisticsComponent!: CourseStatisticsComponent;
  @ViewChild(CourseFilterComponent) filterComponent!: CourseFilterComponent;
  @ViewChild('pageTitle') pageTitle!: ElementRef;
  
  // ViewChildren для доступа к нескольким компонентам
  @ViewChildren(CourseCardComponent) courseCards!: QueryList<CourseCardComponent>;
  @ViewChildren('filterElement') filterElements!: QueryList<ElementRef>;
  
  // Для демонстрации ContentChild (будет использоваться в шаблоне)
  @ContentChild('additionalContent') additionalContent: any;

  ngOnInit() {
    this.initializeCourses();
    this.calculateStats();
  }

  ngAfterViewInit() {
    // Демонстрация использования ViewChild
    console.log('Statistics component:', this.statisticsComponent);
    console.log('Filter component:', this.filterComponent);
    console.log('Page title:', this.pageTitle.nativeElement.textContent);
    
    // Демонстрация использования ViewChildren
    console.log('Number of course cards:', this.courseCards.length);
    console.log('Number of filter elements:', this.filterElements.length);
    
    // Подписка на изменения списка карточек
    this.courseCards.changes.subscribe(cards => {
      console.log('Course cards changed:', cards.length);
    });
    
    // Анимация заголовка
    if (this.pageTitle) {
      this.pageTitle.nativeElement.style.animation = 'slideInDown 0.5s ease';
    }
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

  private calculateStats() {
    this.totalCourses = this.courses.length;
    this.averageRating = Number((this.courses.reduce((sum, c) => sum + c.rating, 0) / this.totalCourses).toFixed(1));
    this.totalStudents = this.courses.reduce((sum, c) => sum + c.students, 0);
  }

  // Фильтрация курсов
  get filteredCourses(): Course[] {
    return this.courses.filter(course => {
      if (this.selectedLevel !== 'all' && course.level !== this.selectedLevel) return false;
      if (this.selectedCategory !== 'all' && course.category !== this.selectedCategory) return false;
      if (this.showOnlyPopular && !course.isPopular) return false;
      if (this.showOnlyNew && !course.isNew) return false;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return course.title.toLowerCase().includes(query) || 
               course.description.toLowerCase().includes(query) ||
               course.teacher.name.toLowerCase().includes(query);
      }
      
      return true;
    }).sort((a, b) => {
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

  // Обработчики событий от дочерних компонентов
  onCardClick(courseId: number) {
    console.log('Card clicked:', courseId);
    this.highlightedCourseId = courseId;
    
    // Демонстрация доступа к дочернему компоненту через ViewChild
    setTimeout(() => {
      this.highlightedCourseId = null;
    }, 2000);
  }

  onCourseLike(course: Course) {
    console.log('Course liked:', course.title);
    
    // Демонстрация использования ViewChildren
    this.courseCards.forEach((card, index) => {
      console.log(`Card ${index} state:`, card.isLiked);
    });
  }

  onViewDetails(course: Course) {
    console.log('View details:', course.title);
    alert(`Подробная информация о курсе "${course.title}" будет доступна в следующей версии!`);
  }

  // Обработчики фильтров
  onLevelChange(level: any) {
    this.selectedLevel = level;
  }

  onCategoryChange(category: any) {
    this.selectedCategory = category;
  }

  onPopularChange(popular: boolean) {
    this.showOnlyPopular = popular;
  }

  onNewChange(isNew: boolean) {
    this.showOnlyNew = isNew;
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
  }

  onSortByChange(sort: string) {
    this.sortBy = sort as any;
  }

  onSortDirectionChange(direction: 'asc' | 'desc') {
    this.sortDirection = direction;
  }

  resetAllFilters() {
    this.selectedLevel = 'all';
    this.selectedCategory = 'all';
    this.showOnlyPopular = false;
    this.showOnlyNew = false;
    this.searchQuery = '';
    this.sortBy = 'rating';
    this.sortDirection = 'desc';
    
    // Демонстрация вызова метода дочернего компонента
    if (this.filterComponent) {
      console.log('Filters reset by parent component');
    }
  }

  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  changeViewMode(mode: 'grid' | 'list' | 'compact') {
    this.selectedViewMode = mode;
    
    // Демонстрация доступа к DOM через ViewChild
    if (this.pageTitle) {
      this.pageTitle.nativeElement.style.transform = 'scale(1.1)';
      setTimeout(() => {
        this.pageTitle.nativeElement.style.transform = 'scale(1)';
      }, 200);
    }
  }
}