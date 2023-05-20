import { TestBed } from '@angular/core/testing';

import { CurrentBrowserService } from './current-browser.service';

describe('CurrentBrowserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentBrowserService = TestBed.get(CurrentBrowserService);
    expect(service).toBeTruthy();
  });
});
