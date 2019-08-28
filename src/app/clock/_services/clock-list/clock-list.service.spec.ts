import { TestBed } from '@angular/core/testing';

import { ClockListService } from './clock-list.service';

describe('ClockListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClockListService = TestBed.get(ClockListService);
    expect(service).toBeTruthy();
  });
});
