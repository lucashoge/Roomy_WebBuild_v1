import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatverlaeufeComponent } from './chatverlaeufe.component';

describe('ChatverlaeufeComponent', () => {
  let component: ChatverlaeufeComponent;
  let fixture: ComponentFixture<ChatverlaeufeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatverlaeufeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatverlaeufeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
