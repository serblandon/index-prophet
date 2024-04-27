import { TestBed } from '@angular/core/testing';

import { IndividualAssetPredictedService } from './individual-asset-predicted.service';

describe('IndividualAssetPredictedService', () => {
  let service: IndividualAssetPredictedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndividualAssetPredictedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
