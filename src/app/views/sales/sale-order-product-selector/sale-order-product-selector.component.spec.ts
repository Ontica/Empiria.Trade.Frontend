/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderProductSelectorComponent } from './sale-order-product-selector.component';

describe('SaleOrderProductSelectorComponent', () => {
  let component: SaleOrderProductSelectorComponent;
  let fixture: ComponentFixture<SaleOrderProductSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderProductSelectorComponent]
    });
    fixture = TestBed.createComponent(SaleOrderProductSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
