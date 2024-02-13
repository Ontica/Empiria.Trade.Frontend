/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingViewerComponent } from './shipping-viewer.component';

describe('ShippingViewerComponent', () => {
  let component: ShippingViewerComponent;
  let fixture: ComponentFixture<ShippingViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingViewerComponent]
    });
    fixture = TestBed.createComponent(ShippingViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
