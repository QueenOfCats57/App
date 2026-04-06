import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Course, CourseLevel, CourseCategory } from '../../pages/course-list/course.model';
import { CourseService } from '../../services/course.service';
import { CourseCardComponent } from '../../pages/course-card/course-card';
import { CourseFilterComponent } from '../../pages/course-filter/course-filter';
import { CourseStatisticsComponent } from '../../pages/course-statistics/course-statistics';
import { CourseFilter } from '../../services/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CourseCardComponent,
    CourseFilterComponent,
    CourseStatisticsComponent
  ],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.scss']
})
export class CourseList implements OnInit, OnDestroy, AfterViewInit {
  // Данные о курсах из сервиса
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  
  // Состояние фильтров
  selectedLevel: CourseLevel | 'all' = 'all';
  selectedCategory: CourseCategory | 'all' = 'all';
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
  
  // Состояние загрузки и ошибок
  isLoading: boolean = false;
  error: string | null = null;
  
  // Статистика
  totalCourses: number = 0;
  averageRating: number = 0;
  totalStudents: number = 0;
  
  // Подписки для отписки при уничтожении
  private subscriptions: Subscription = new Subscription();
  
  // ViewChild для доступа к дочерним компонентам
  @ViewChild(CourseStatisticsComponent) statisticsComponent!: CourseStatisticsComponent;
  @ViewChild(CourseFilterComponent) filterComponent!: CourseFilterComponent;
  @ViewChild('pageTitle') pageTitle!: ElementRef;
  
  // ViewChildren для доступа к нескольким компонентам
  @ViewChildren(CourseCardComponent) courseCards!: QueryList<CourseCardComponent>;
  
  constructor(private courseService: CourseService) {}
  
  ngOnInit(): void {
    // Подписка на загрузку курсов
    this.subscriptions.add(
      this.courseService.getAllCourses().subscribe({
        next: (courses) => {
          this.courses = courses;
          this.applyFilters();
          this.calculateStats();
          console.log('✅ Курсы загружены из сервиса:', courses.length);
        },
        error: (error) => {
          this.error = 'Не удалось загрузить курсы. Пожалуйста, попробуйте позже.';
          console.error('Ошибка загрузки курсов:', error);
        }
      })
    );
    
    // Подписка на состояние загрузки
    this.subscriptions.add(
      this.courseService.loading$.subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );
    
    // Подписка на ошибки
    this.subscriptions.add(
      this.courseService.error$.subscribe(error => {
        if (error) {
          this.error = error;
          setTimeout(() => this.courseService.clearError(), 5000);
        }
      })
    );
  }
  
  ngAfterViewInit(): void {
    if (this.pageTitle) {
      this.pageTitle.nativeElement.style.animation = 'slideInDown 0.5s ease';
    }
  }
  
  ngOnDestroy(): void {
    // Отписываемся от всех подписок для предотвращения утечек памяти
    this.subscriptions.unsubscribe();
    console.log('🧹 CourseList компонент уничтожен, подписки очищены');
  }
  
  /**
   * Применение фильтров через сервис
   */
  applyFilters(): void {
    const filter: CourseFilter = {
      level: this.selectedLevel,
      category: this.selectedCategory,
      searchQuery: this.searchQuery,
      showOnlyPopular: this.showOnlyPopular,
      showOnlyNew: this.showOnlyNew,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };
    
    this.subscriptions.add(
      this.courseService.getFilteredCourses(filter).subscribe({
        next: (filtered) => {
          this.filteredCourses = filtered;
          this.calculateStats();
          console.log(`✅ Применены фильтры: найдено ${filtered.length} курсов`);
        },
        error: (error) => {
          console.error('Ошибка фильтрации:', error);
        }
      })
    );
  }
  
  /**
   * Вычисление статистики через сервис
   */
  calculateStats(): void {
    this.subscriptions.add(
      this.courseService.getStatistics().subscribe(stats => {
        this.totalCourses = stats.totalCourses;
        this.averageRating = stats.averageRating;
        this.totalStudents = stats.totalStudents;
      })
    );
  }
  
  /**
   * Обновление фильтров и переприменение
   */
  updateFiltersAndApply(): void {
    this.applyFilters();
  }
  
  // Обработчики событий от дочерних компонентов
  
  onCardClick(courseId: number): void {
    console.log('Card clicked:', courseId);
    this.highlightedCourseId = courseId;
    setTimeout(() => {
      this.highlightedCourseId = null;
    }, 2000);
  }
  
  onCourseLike(course: Course): void {
    // Обновление количества лайков через сервис
    this.subscriptions.add(
      this.courseService.updateCourse(course.id, {
        students: course.students + 1
      }).subscribe({
        next: (updatedCourse) => {
          console.log(`❤️ Лайк добавлен курсу "${updatedCourse.title}"`);
        },
        error: (error) => {
          console.error('Ошибка при обновлении курса:', error);
        }
      })
    );
  }
  
  onViewDetails(course: Course): void {
    console.log('View details:', course.title);
    // Здесь можно открыть модальное окно или перейти на страницу курса
    alert(`Подробная информация о курсе "${course.title}"\n\nОписание: ${course.description}\nПреподаватель: ${course.teacher.name}\nДлительность: ${course.duration} недель\nСтоимость: ${course.discountPrice || course.price} ₽`);
  }
  
  // Обработчики фильтров
  
  onLevelChange(level: CourseLevel | 'all'): void {
    this.selectedLevel = level;
    this.applyFilters();
  }
  
  onCategoryChange(category: CourseCategory | 'all'): void {
    this.selectedCategory = category;
    this.applyFilters();
  }
  
  onPopularChange(popular: boolean): void {
    this.showOnlyPopular = popular;
    this.applyFilters();
  }
  
  onNewChange(isNew: boolean): void {
    this.showOnlyNew = isNew;
    this.applyFilters();
  }
  
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }
  
  onSortByChange(sort: string): void {
    this.sortBy = sort as any;
    this.applyFilters();
  }
  
  onSortDirectionChange(direction: 'asc' | 'desc'): void {
    this.sortDirection = direction;
    this.applyFilters();
  }
  
  resetAllFilters(): void {
    this.selectedLevel = 'all';
    this.selectedCategory = 'all';
    this.showOnlyPopular = false;
    this.showOnlyNew = false;
    this.searchQuery = '';
    this.sortBy = 'rating';
    this.sortDirection = 'desc';
    this.applyFilters();
    console.log('🔄 Все фильтры сброшены');
  }
  
  toggleFilters(): void {
    this.isFiltersVisible = !this.isFiltersVisible;
  }
  
  changeViewMode(mode: 'grid' | 'list' | 'compact'): void {
    this.selectedViewMode = mode;
    console.log(`🎨 Режим отображения изменен на: ${mode}`);
  }
}