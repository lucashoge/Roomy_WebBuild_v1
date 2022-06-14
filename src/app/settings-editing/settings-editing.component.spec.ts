import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsEditingComponent } from './settings-editing.component';

describe('SettingsEditingComponent', () => {
  let component: SettingsEditingComponent;
  let fixture: ComponentFixture<SettingsEditingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsEditingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
