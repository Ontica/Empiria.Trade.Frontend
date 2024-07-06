/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderCreatorComponent } from './purchase-order-creator.component';

describe('PurchaseOrderCreatorComponent', () => {
  let component: PurchaseOrderCreatorComponent;
  let fixture: ComponentFixture<PurchaseOrderCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseOrderCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
