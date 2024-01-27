/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingOrdersTableComponent } from './shipping-orders-table.component';

describe('ShippingOrdersTableComponent', () => {
  let component: ShippingOrdersTableComponent;
  let fixture: ComponentFixture<ShippingOrdersTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingOrdersTableComponent]
    });
    fixture = TestBed.createComponent(ShippingOrdersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
