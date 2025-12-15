import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsProductComponent } from './tabs-product.component';

describe('TabsProductComponent', () => {
  let component: TabsProductComponent;
  let fixture: ComponentFixture<TabsProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
