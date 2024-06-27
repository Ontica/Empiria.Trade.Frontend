/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderTotalsComponent } from './sale-order-totals.component';

describe('SaleOrderTotalsComponent', () => {
  let component: SaleOrderTotalsComponent;
  let fixture: ComponentFixture<SaleOrderTotalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderTotalsComponent]
    });
    fixture = TestBed.createComponent(SaleOrderTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
