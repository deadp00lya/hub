import { TestBed } from '@angular/core/testing';

import { MdmService } from './mdm.service';

describe('MdmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MdmService = TestBed.get(MdmService);
    expect(service).toBeTruthy();
  });
});
