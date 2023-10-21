/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCreatorComponent } from './order-creator.component';

describe('OrderCreatorComponent', () => {
  let component: OrderCreatorComponent;
  let fixture: ComponentFixture<OrderCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderCreatorComponent]
    });
    fixture = TestBed.createComponent(OrderCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
