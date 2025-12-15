import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuscriptionsComponent } from './suscriptions.component';

describe('SuscriptionsComponent', () => {
  let component: SuscriptionsComponent;
  let fixture: ComponentFixture<SuscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuscriptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
