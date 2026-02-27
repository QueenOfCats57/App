import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, CourseLevel } from '../../pages/course-list/course.model';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.html',
  styleUrls: ['./course-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCardComponent implements AfterViewInit {
  @Input() course!: Course;
  @Input() viewMode: 'grid' | 'list' | 'compact' = 'grid';
  @Input() isHighlighted: boolean = false;
  
  @Output() cardClick = new EventEmitter<number>();
  @Output() like = new EventEmitter<Course>();
  @Output() viewDetails = new EventEmitter<Course>();
  
  // ViewChild для доступа к DOM элементам
  @ViewChild('cardElement') cardElement!: ElementRef;
  @ViewChild('titleElement') titleElement!: ElementRef;
  @ViewChild('likeButton') likeButton!: ElementRef;
  
  // Шаблонные переменные будут использоваться в шаблоне
  isLiked: boolean = false;
  showFullDescription: boolean = false;
  
  ngAfterViewInit() {
    // Демонстрация использования ViewChild
    console.log('Course card initialized:', this.course.title);
    this.animateCard();
  }
  
  animateCard() {
    if (this.cardElement) {
      this.cardElement.nativeElement.style.animation = 'fadeInUp 0.5s ease';
    }
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
  
  getCategoryIcon(category: string): string {
    const icons = {
      'general': '📚',
      'business': '💼',
      'exam': '📝',
      'conversation': '💬'
    };
    return icons[category as keyof typeof icons] || '📚';
  }
  
  onCardClick() {
    this.cardClick.emit(this.course.id);
  }
  
  toggleLike(event: Event) {
    event.stopPropagation();
    this.isLiked = !this.isLiked;
    this.like.emit(this.course);
    
    // Демонстрация использования ViewChild для изменения стиля
    if (this.likeButton) {
      this.likeButton.nativeElement.style.transform = 'scale(1.3)';
      setTimeout(() => {
        this.likeButton.nativeElement.style.transform = 'scale(1)';
      }, 200);
    }
  }
  
  onViewDetails(event: Event) {
    event.stopPropagation();
    this.viewDetails.emit(this.course);
  }
  
  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
  
  getPriceWithDiscount(): number {
    return this.course.discountPrice || this.course.price;
  }
  
  getCardClasses() {
    return {
      'popular-course': this.course.isPopular,
      'new-course': this.course.isNew,
      'discount-course': this.course.hasDiscount,
      'highlighted': this.isHighlighted,
      [`view-${this.viewMode}`]: true
    };
  }
}