/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSubmitterComponent } from './order-submitter.component';

describe('OrderSubmitterComponent', () => {
  let component: OrderSubmitterComponent;
  let fixture: ComponentFixture<OrderSubmitterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderSubmitterComponent]
    });
    fixture = TestBed.createComponent(OrderSubmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
