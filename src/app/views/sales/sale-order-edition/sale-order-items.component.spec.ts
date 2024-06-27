/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderItemsComponent } from './sale-order-items.component';

describe('SaleOrderItemsComponent', () => {
  let component: SaleOrderItemsComponent;
  let fixture: ComponentFixture<SaleOrderItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderItemsComponent]
    });
    fixture = TestBed.createComponent(SaleOrderItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
