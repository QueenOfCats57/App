import { Component, Input, ContentChildren, QueryList, AfterContentInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-section.html',
  styleUrls: ['./filter-section.scss']
})
export class FilterSectionComponent implements AfterContentInit {
  @Input() title: string = '';
  @Input() icon: string = '🔍';
  @Input() isExpanded: boolean = true;
  
  // ContentChild для доступа к первому элементу
  @ContentChildren('filterContent') contentChildren!: QueryList<ElementRef>;
  
  ngAfterContentInit() {
    // Демонстрация использования ContentChildren
    console.log(`Filter section "${this.title}" has ${this.contentChildren.length} content children`);
    
    this.contentChildren.changes.subscribe(() => {
      console.log('Content children changed');
    });
  }
  
  toggleSection() {
    this.isExpanded = !this.isExpanded;
  }
}