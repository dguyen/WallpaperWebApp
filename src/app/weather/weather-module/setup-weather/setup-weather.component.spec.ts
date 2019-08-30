import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupWeatherComponent } from './setup-weather.component';

describe('SetupWeatherComponent', () => {
  let component: SetupWeatherComponent;
  let fixture: ComponentFixture<SetupWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupWeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
