/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditionComponent } from './order-edition.component';

describe('OrderEditionComponent', () => {
  let component: OrderEditionComponent;
  let fixture: ComponentFixture<OrderEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderEditionComponent]
    });
    fixture = TestBed.createComponent(OrderEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
