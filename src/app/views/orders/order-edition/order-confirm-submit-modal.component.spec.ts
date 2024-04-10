/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmSubmitModalComponent } from './order-confirm-submit-modal.component';

describe('OrderConfirmSubmitModalComponent', () => {
  let component: OrderConfirmSubmitModalComponent;
  let fixture: ComponentFixture<OrderConfirmSubmitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderConfirmSubmitModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderConfirmSubmitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
