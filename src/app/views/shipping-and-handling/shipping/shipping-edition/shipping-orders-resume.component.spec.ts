/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingOrdersResumeComponent } from './shipping-orders-resume.component';

describe('ShippingOrdersResumeComponent', () => {
  let component: ShippingOrdersResumeComponent;
  let fixture: ComponentFixture<ShippingOrdersResumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingOrdersResumeComponent]
    });
    fixture = TestBed.createComponent(ShippingOrdersResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
