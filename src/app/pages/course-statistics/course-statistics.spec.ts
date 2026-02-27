import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseStatistics } from './course-statistics';

describe('CourseStatistics', () => {
  let component: CourseStatistics;
  let fixture: ComponentFixture<CourseStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseStatistics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseStatistics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
