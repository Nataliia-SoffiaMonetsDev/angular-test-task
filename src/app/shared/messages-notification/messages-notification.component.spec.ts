import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesNotificationComponent } from './messages-notification.component';

describe('MessagesNotificationComponent', () => {
  let component: MessagesNotificationComponent;
  let fixture: ComponentFixture<MessagesNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessagesNotificationComponent]
    });
    fixture = TestBed.createComponent(MessagesNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
