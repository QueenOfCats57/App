import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../services/course.model';
import { HighlightDirective } from '../../directives/highlight';
import { FreeOnlyDirective } from '../../directives/free-only';
import { PaidOnlyDirective } from '../../directives/paid-only';

@Component({
  selector: 'app-directives-demo',
  standalone: true,
  imports: [CommonModule, RouterModule, HighlightDirective, FreeOnlyDirective, PaidOnlyDirective],
  templateUrl: './directives-demo.html',
  styleUrls: ['./directives-demo.scss']
})
export class DirectivesDemoComponent implements OnInit {
  
  allCourses: Course[] = [];
  showFree: boolean = false;
  showPaid: boolean = false;
  
  constructor(private courseService: CourseService) {}
  
  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe(courses => {
      this.allCourses = courses;
    });
  }
  
  toggleFree() {
    this.showFree = true;
    this.showPaid = false;
  }
  
  togglePaid() {
    this.showPaid = true;
    this.showFree = false;
  }
  
  showAll() {
    this.showFree = false;
    this.showPaid = false;
  }
}