/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

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
