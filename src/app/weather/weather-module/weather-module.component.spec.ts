import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherModuleComponent } from './weather-module.component';

describe('WeatherModuleComponent', () => {
  let component: WeatherModuleComponent;
  let fixture: ComponentFixture<WeatherModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
