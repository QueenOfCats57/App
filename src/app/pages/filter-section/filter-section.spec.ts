import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSection } from './filter-section';

describe('FilterSection', () => {
  let component: FilterSection;
  let fixture: ComponentFixture<FilterSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
