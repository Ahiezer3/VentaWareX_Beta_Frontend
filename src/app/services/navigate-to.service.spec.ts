import { TestBed } from '@angular/core/testing';

import { NavigateToService } from './navigate-to.service';

describe('NavigateToService', () => {
  let service: NavigateToService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigateToService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
