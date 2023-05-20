import { TestBed } from '@angular/core/testing';

import { AppsAuthGuard } from './apps-auth.guard';

describe('AppsAuthGuard', () => {
  let guard: AppsAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AppsAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
