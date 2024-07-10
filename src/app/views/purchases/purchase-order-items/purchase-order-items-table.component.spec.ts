/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderItemsTableComponent } from './purchase-order-items-table.component';

describe('PurchaseOrderItemsTableComponent', () => {
  let component: PurchaseOrderItemsTableComponent;
  let fixture: ComponentFixture<PurchaseOrderItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseOrderItemsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
