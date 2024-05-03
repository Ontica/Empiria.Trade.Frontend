/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderItemsTableComponent } from './inventory-order-items-table.component';

describe('InventoryOrderItemsTableComponent', () => {
  let component: InventoryOrderItemsTableComponent;
  let fixture: ComponentFixture<InventoryOrderItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryOrderItemsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
