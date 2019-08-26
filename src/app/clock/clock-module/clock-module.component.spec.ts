import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockModuleComponent } from './clock-module.component';

describe('ClockModuleComponent', () => {
  let component: ClockModuleComponent;
  let fixture: ComponentFixture<ClockModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
