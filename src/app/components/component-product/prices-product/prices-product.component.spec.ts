import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesProductComponent } from './prices-product.component';

describe('PricesProductComponent', () => {
  let component: PricesProductComponent;
  let fixture: ComponentFixture<PricesProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricesProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricesProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
