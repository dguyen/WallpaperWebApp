import { TestBed } from '@angular/core/testing';

import { ClockSettingsService } from './clock-settings.service';

describe('ClockSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClockSettingsService = TestBed.get(ClockSettingsService);
    expect(service).toBeTruthy();
  });
});
