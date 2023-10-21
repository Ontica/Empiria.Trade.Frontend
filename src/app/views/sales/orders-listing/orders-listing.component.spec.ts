/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersListingComponent } from './orders-listing.component';

describe('OrdersListingComponent', () => {
  let component: OrdersListingComponent;
  let fixture: ComponentFixture<OrdersListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdersListingComponent]
    });
    fixture = TestBed.createComponent(OrdersListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
