import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockOneComponent } from './clock-one.component';

describe('ClockOneComponent', () => {
  let component: ClockOneComponent;
  let fixture: ComponentFixture<ClockOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
