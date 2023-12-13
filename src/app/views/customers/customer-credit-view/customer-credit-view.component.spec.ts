import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCreditViewComponent } from './customer-credit-view.component';

describe('CustomerCreditViewComponent', () => {
  let component: CustomerCreditViewComponent;
  let fixture: ComponentFixture<CustomerCreditViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCreditViewComponent]
    });
    fixture = TestBed.createComponent(CustomerCreditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
