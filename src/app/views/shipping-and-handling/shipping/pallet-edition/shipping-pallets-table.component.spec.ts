/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPalletsTableComponent } from './shipping-pallets-table.component';

describe('ShippingPalletsTableComponent', () => {
  let component: ShippingPalletsTableComponent;
  let fixture: ComponentFixture<ShippingPalletsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingPalletsTableComponent]
    });
    fixture = TestBed.createComponent(ShippingPalletsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
