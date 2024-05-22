import { TestBed } from '@angular/core/testing';

import { TechnicalIndicatorService } from './technical-indicator.service';

describe('TechnicalIndicatorService', () => {
  let service: TechnicalIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicalIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
