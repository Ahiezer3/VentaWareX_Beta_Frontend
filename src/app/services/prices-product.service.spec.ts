import { TestBed } from '@angular/core/testing';

import { PricesProductService } from './prices-product.service';

describe('PricesProductService', () => {
  let service: PricesProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PricesProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
