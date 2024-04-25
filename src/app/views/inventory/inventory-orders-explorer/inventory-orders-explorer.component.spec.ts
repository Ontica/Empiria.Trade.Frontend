/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrdersExplorerComponent } from './inventory-orders-explorer.component';

describe('InventoryOrdersExplorerComponent', () => {
  let component: InventoryOrdersExplorerComponent;
  let fixture: ComponentFixture<InventoryOrdersExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryOrdersExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrdersExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
