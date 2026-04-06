import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsDemo } from './forms-demo';

describe('FormsDemo', () => {
  let component: FormsDemo;
  let fixture: ComponentFixture<FormsDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
