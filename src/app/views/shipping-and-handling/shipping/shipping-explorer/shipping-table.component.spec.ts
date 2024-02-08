/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingTableComponent } from './shipping-table.component';

describe('ShippingTableComponent', () => {
  let component: ShippingTableComponent;
  let fixture: ComponentFixture<ShippingTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingTableComponent]
    });
    fixture = TestBed.createComponent(ShippingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
