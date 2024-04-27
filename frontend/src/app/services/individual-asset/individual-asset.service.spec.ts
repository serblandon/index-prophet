import { TestBed } from '@angular/core/testing';

import { IndividualAssetHistoricalService } from './individual-asset.service';

describe('IndividualAssetHistoricalService', () => {
  let service: IndividualAssetHistoricalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndividualAssetHistoricalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
