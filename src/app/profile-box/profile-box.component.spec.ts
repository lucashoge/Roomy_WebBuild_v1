import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBoxComponent } from './profile-box.component';

describe('ProfileBoxComponent', () => {
  let component: ProfileBoxComponent;
  let fixture: ComponentFixture<ProfileBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
