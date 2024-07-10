/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderProductSelectorComponent } from './purchase-order-product-selector.component';

describe('PurchaseOrderProductSelectorComponent', () => {
  let component: PurchaseOrderProductSelectorComponent;
  let fixture: ComponentFixture<PurchaseOrderProductSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseOrderProductSelectorComponent]
    });
    fixture = TestBed.createComponent(PurchaseOrderProductSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
