import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExistencesProductComponent } from './existences-product.component';
import { TabsProductComponent } from '../tabs-product/tabs-product.component';

describe('ExistencesProductComponent', () => {
  let component: ExistencesProductComponent;
  let fixture: ComponentFixture<ExistencesProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistencesProductComponent,TabsProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistencesProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
