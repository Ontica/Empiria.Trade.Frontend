/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingTabbedViewComponent } from './shipping-tabbed-view.component';

describe('ShippingTabbedViewComponent', () => {
  let component: ShippingTabbedViewComponent;
  let fixture: ComponentFixture<ShippingTabbedViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingTabbedViewComponent]
    });
    fixture = TestBed.createComponent(ShippingTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
