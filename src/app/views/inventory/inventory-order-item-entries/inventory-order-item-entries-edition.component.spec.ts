/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderItemEntriesEditionComponent } from './inventory-order-item-entries-edition.component';

describe('InventoryOrderItemEntriesEditionComponent', () => {
  let component: InventoryOrderItemEntriesEditionComponent;
  let fixture: ComponentFixture<InventoryOrderItemEntriesEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryOrderItemEntriesEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderItemEntriesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
