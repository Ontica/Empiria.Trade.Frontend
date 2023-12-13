import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCreditTableComponent } from './customer-credit-table.component';

describe('CustomerCreditTableComponent', () => {
  let component: CustomerCreditTableComponent;
  let fixture: ComponentFixture<CustomerCreditTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCreditTableComponent]
    });
    fixture = TestBed.createComponent(CustomerCreditTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
