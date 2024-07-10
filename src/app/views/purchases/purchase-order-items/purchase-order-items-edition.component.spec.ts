/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderItemsEditionComponent } from './purchase-order-items-edition.component';

describe('PurchaseOrderItemsEditionComponent', () => {
  let component: PurchaseOrderItemsEditionComponent;
  let fixture: ComponentFixture<PurchaseOrderItemsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseOrderItemsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderItemsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
