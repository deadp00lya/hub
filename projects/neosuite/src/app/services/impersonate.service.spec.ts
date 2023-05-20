import { TestBed } from '@angular/core/testing';

import { ImpersonateService } from './impersonate.service';

describe('ImpersonateService', () => {
  let service: ImpersonateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpersonateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
