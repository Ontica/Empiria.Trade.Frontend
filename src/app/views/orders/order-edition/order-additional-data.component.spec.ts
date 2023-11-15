/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAdditionalDataComponent } from './order-additional-data.component';

describe('OrderAdditionalDataComponent', () => {
  let component: OrderAdditionalDataComponent;
  let fixture: ComponentFixture<OrderAdditionalDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderAdditionalDataComponent]
    });
    fixture = TestBed.createComponent(OrderAdditionalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
