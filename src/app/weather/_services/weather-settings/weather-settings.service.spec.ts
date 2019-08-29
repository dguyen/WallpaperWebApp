import { TestBed } from '@angular/core/testing';

import { WeatherSettingsService } from './weather-settings.service';

describe('WeatherSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeatherSettingsService = TestBed.get(WeatherSettingsService);
    expect(service).toBeTruthy();
  });
});
