import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBoxComponentComponent } from './profile-box-component.component';

describe('ProfileBoxComponentComponent', () => {
  let component: ProfileBoxComponentComponent;
  let fixture: ComponentFixture<ProfileBoxComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileBoxComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBoxComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
