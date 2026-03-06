import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseStatisticsComponent } from './course-statistics';

describe('CourseStatistics', () => {
  let component: CourseStatisticsComponent;
  let fixture: ComponentFixture<CourseStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseStatisticsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
