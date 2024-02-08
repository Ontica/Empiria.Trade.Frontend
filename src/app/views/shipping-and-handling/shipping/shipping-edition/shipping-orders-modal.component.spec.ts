/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingOrdersModalComponent } from './shipping-orders-modal.component';

describe('ShippingOrdersModalComponent', () => {
  let component: ShippingOrdersModalComponent;
  let fixture: ComponentFixture<ShippingOrdersModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingOrdersModalComponent]
    });
    fixture = TestBed.createComponent(ShippingOrdersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
