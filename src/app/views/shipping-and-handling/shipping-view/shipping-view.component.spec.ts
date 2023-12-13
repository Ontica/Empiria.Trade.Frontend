import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingViewComponent } from './shipping-view.component';

describe('ShippingViewComponent', () => {
  let component: ShippingViewComponent;
  let fixture: ComponentFixture<ShippingViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingViewComponent]
    });
    fixture = TestBed.createComponent(ShippingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
