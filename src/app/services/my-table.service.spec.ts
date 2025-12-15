import { TestBed } from '@angular/core/testing';

import { MyTableService } from './my-table.service';

describe('MyTableService', () => {
  let service: MyTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
