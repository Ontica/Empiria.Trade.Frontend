/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderShippingViewerComponent } from './order-shipping-viewer.component';

describe('OrderShippingViewerComponent', () => {
  let component: OrderShippingViewerComponent;
  let fixture: ComponentFixture<OrderShippingViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderShippingViewerComponent]
    });
    fixture = TestBed.createComponent(OrderShippingViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
