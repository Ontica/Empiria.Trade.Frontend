/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderTabbedViewComponent } from './inventory-order-tabbed-view.component';

describe('InventoryOrderTabbedViewComponent', () => {
  let component: InventoryOrderTabbedViewComponent;
  let fixture: ComponentFixture<InventoryOrderTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryOrderTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
