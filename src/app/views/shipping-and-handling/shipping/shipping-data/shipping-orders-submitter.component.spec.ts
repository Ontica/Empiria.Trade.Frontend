/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingOrdersSubmitterComponent } from './shipping-orders-submitter.component';

describe('ShippingOrdersSubmitterComponent', () => {
  let component: ShippingOrdersSubmitterComponent;
  let fixture: ComponentFixture<ShippingOrdersSubmitterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingOrdersSubmitterComponent]
    });
    fixture = TestBed.createComponent(ShippingOrdersSubmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
