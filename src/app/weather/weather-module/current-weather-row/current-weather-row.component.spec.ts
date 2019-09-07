import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeatherRowComponent } from './current-weather-row.component';

describe('CurrentWeatherRowComponent', () => {
  let component: CurrentWeatherRowComponent;
  let fixture: ComponentFixture<CurrentWeatherRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentWeatherRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentWeatherRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
