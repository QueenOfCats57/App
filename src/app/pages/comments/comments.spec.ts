import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentChatComponent } from './comments';

describe('Comments', () => {
  let component: CommentChatComponent;
  let fixture: ComponentFixture<CommentChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentChatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
