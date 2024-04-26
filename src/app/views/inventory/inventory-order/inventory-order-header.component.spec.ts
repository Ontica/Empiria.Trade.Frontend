/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderHeaderComponent } from './inventory-order-header.component';

describe('InventoryOrderHeaderComponent', () => {
  let component: InventoryOrderHeaderComponent;
  let fixture: ComponentFixture<InventoryOrderHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryOrderHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
