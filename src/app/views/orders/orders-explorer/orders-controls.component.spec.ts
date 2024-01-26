/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersControlsComponent } from './orders-controls.component';

describe('OrdersControlsComponent', () => {
  let component: OrdersControlsComponent;
  let fixture: ComponentFixture<OrdersControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdersControlsComponent]
    });
    fixture = TestBed.createComponent(OrdersControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
