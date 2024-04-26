/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderItemsEditionComponent } from './inventory-order-items-edition.component';

describe('InventoryOrderItemsEditionComponent', () => {
  let component: InventoryOrderItemsEditionComponent;
  let fixture: ComponentFixture<InventoryOrderItemsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryOrderItemsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderItemsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
