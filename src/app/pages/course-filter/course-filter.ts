import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterSectionComponent } from '../filter-section/filter-section';
import { CourseLevel, CourseCategory } from '../../pages/course-list/course.model';

@Component({
  selector: 'app-course-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterSectionComponent],
  templateUrl: './course-filter.html',
  styleUrls: ['./course-filter.scss']
})
export class CourseFilterComponent implements AfterViewInit {
  @Input() selectedLevel: CourseLevel | 'all' = 'all';
  @Input() selectedCategory: CourseCategory | 'all' = 'all';
  @Input() showOnlyPopular: boolean = false;
  @Input() showOnlyNew: boolean = false;
  @Input() searchQuery: string = '';
  @Input() sortBy: string = 'rating';
  @Input() sortDirection: 'asc' | 'desc' = 'desc';
  @Input() isVisible: boolean = true;
  
  @Output() selectedLevelChange = new EventEmitter<CourseLevel | 'all'>();
  @Output() selectedCategoryChange = new EventEmitter<CourseCategory | 'all'>();
  @Output() showOnlyPopularChange = new EventEmitter<boolean>();
  @Output() showOnlyNewChange = new EventEmitter<boolean>();
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();
  @Output() sortDirectionChange = new EventEmitter<'asc' | 'desc'>();
  @Output() resetFilters = new EventEmitter<void>();
  
  // ViewChildren для доступа к нескольким элементам
  @ViewChildren('filterInput') filterInputs!: QueryList<ElementRef>;
  
  ngAfterViewInit() {
    // Демонстрация использования ViewChildren
    console.log('Number of filter inputs:', this.filterInputs.length);
    
    this.filterInputs.changes.subscribe(inputs => {
      console.log('Filter inputs changed:', inputs.length);
    });
  }
  
  onLevelChange(level: CourseLevel | 'all') {
    this.selectedLevelChange.emit(level);
  }
  
  onCategoryChange(category: CourseCategory | 'all') {
    this.selectedCategoryChange.emit(category);
  }
  
  onPopularChange(popular: boolean) {
    this.showOnlyPopularChange.emit(popular);
  }
  
  onNewChange(isNew: boolean) {
    this.showOnlyNewChange.emit(isNew);
  }
  
  onSearchChange(query: string) {
    this.searchQueryChange.emit(query);
  }
  
  onSortByChange(sort: string) {
    this.sortByChange.emit(sort);
  }
  
  toggleSortDirection() {
    this.sortDirectionChange.emit(this.sortDirection === 'asc' ? 'desc' : 'asc');
  }
  
  onResetFilters() {
    this.resetFilters.emit();
  }
}