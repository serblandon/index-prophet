import { TestBed } from '@angular/core/testing';

import { LiveApiService } from './LiveApiService';

describe('LiveApiService', () => {
  let service: LiveApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
