import { TestBed } from '@angular/core/testing';
import { ProfileImageLoaderService } from './profile-image-loader.service';

describe('ProfileImageLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileImageLoaderService = TestBed.get(ProfileImageLoaderService);
    expect(service).toBeTruthy();
  });
});
