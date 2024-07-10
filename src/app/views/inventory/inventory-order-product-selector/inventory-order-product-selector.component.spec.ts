/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderProductSelectorComponent } from './inventory-order-product-selector.component';

describe('InventoryOrderProductSelectorComponent', () => {
  let component: InventoryOrderProductSelectorComponent;
  let fixture: ComponentFixture<InventoryOrderProductSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryOrderProductSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderProductSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
