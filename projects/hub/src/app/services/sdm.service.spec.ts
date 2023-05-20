import { TestBed } from '@angular/core/testing';

import { SdmService } from './sdm.service';

describe('SdmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SdmService = TestBed.get(SdmService);
    expect(service).toBeTruthy();
  });
});
