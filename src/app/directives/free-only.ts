import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Course } from '../pages/course-list/course.model';

@Directive({
  selector: '[appFreeOnly]',
  standalone: true
})
export class FreeOnlyDirective {
  
  private hasView = false;
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
  
  @Input() set appFreeOnly(courses: Course[]) {
    // Фильтруем только бесплатные курсы (цена = 0)
    const freeCourses = courses.filter(course => course.price === 0);
    
    if (freeCourses.length > 0 && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: freeCourses });
      this.hasView = true;
    } else if (freeCourses.length === 0 && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}