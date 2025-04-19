/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderItemEntriesTableComponent } from './inventory-order-item-entries-table.component';

describe('InventoryOrderItemEntriesTableComponent', () => {
  let component: InventoryOrderItemEntriesTableComponent;
  let fixture: ComponentFixture<InventoryOrderItemEntriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryOrderItemEntriesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderItemEntriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
