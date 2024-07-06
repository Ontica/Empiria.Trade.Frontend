/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderTabbedViewComponent } from './purchase-order-tabbed-view.component';

describe('PurchaseOrderTabbedViewComponent', () => {
  let component: PurchaseOrderTabbedViewComponent;
  let fixture: ComponentFixture<PurchaseOrderTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseOrderTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
