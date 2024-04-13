import { TestBed } from '@angular/core/testing';

import { IndividualAssetService } from './individual-asset.service';

describe('IndividualAssetService', () => {
  let service: IndividualAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndividualAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
