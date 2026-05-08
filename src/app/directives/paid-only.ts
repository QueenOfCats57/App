import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Course } from '../pages/course-list/course.model';

@Directive({
  selector: '[appPaidOnly]',
  standalone: true
})
export class PaidOnlyDirective {
  
  private hasView = false;
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
  
  @Input() set appPaidOnly(courses: Course[]) {
    // Фильтруем только платные курсы (цена > 0)
    const paidCourses = courses.filter(course => course.price > 0);
    
    if (paidCourses.length > 0 && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: paidCourses });
      this.hasView = true;
    } else if (paidCourses.length === 0 && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}