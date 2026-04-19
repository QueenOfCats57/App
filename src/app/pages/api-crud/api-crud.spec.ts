import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiCrud } from './api-crud';

describe('ApiCrud', () => {
  let component: ApiCrud;
  let fixture: ComponentFixture<ApiCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
