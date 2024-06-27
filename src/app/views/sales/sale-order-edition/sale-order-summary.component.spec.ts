/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderSummaryComponent } from './sale-order-summary.component';

describe('SaleOrderSummaryComponent', () => {
  let component: SaleOrderSummaryComponent;
  let fixture: ComponentFixture<SaleOrderSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderSummaryComponent]
    });
    fixture = TestBed.createComponent(SaleOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
