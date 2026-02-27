import { Component, Input, ContentChild, TemplateRef, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-statistics.html',
  styleUrls: ['./course-statistics.scss']
})
export class CourseStatisticsComponent implements AfterContentInit {
  @Input() totalCourses: number = 0;
  @Input() averageRating: number = 0;
  @Input() totalStudents: number = 0;
  
  // ContentChild для доступа к шаблону
  @ContentChild('statHeader') statHeader!: TemplateRef<any>;
  @ContentChild('statFooter') statFooter!: TemplateRef<any>;
  
  // ViewChild для доступа к своим элементам
  @ViewChild('statsContainer') statsContainer!: ElementRef;
  
  isAnimated: boolean = false;
  
  ngAfterContentInit() {
    console.log('Stat header template exists:', !!this.statHeader);
    console.log('Stat footer template exists:', !!this.statFooter);
  }
  
  ngAfterViewInit() {
    this.animateStats();
  }
  
  animateStats() {
    this.isAnimated = true;
    if (this.statsContainer) {
      this.statsContainer.nativeElement.style.animation = 'pulse 1s ease';
      setTimeout(() => {
        this.statsContainer.nativeElement.style.animation = '';
      }, 1000);
    }
  }
  
  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }
}