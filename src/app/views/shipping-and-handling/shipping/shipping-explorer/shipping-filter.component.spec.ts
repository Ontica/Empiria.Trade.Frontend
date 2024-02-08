/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingFilterComponent } from './shipping-filter.component';

describe('ShippingFilterComponent', () => {
  let component: ShippingFilterComponent;
  let fixture: ComponentFixture<ShippingFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingFilterComponent]
    });
    fixture = TestBed.createComponent(ShippingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
