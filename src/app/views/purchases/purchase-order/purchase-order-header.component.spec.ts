/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderHeaderComponent } from './purchase-order-header.component';

describe('PurchaseOrderHeaderComponent', () => {
  let component: PurchaseOrderHeaderComponent;
  let fixture: ComponentFixture<PurchaseOrderHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseOrderHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
