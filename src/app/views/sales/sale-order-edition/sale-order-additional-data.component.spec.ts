/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderAdditionalDataComponent } from './sale-order-additional-data.component';

describe('SaleOrderAdditionalDataComponent', () => {
  let component: SaleOrderAdditionalDataComponent;
  let fixture: ComponentFixture<SaleOrderAdditionalDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderAdditionalDataComponent]
    });
    fixture = TestBed.createComponent(SaleOrderAdditionalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
