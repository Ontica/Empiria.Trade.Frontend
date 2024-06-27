/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderSubmitterComponent } from './sale-order-submitter.component';

describe('SaleOrderSubmitterComponent', () => {
  let component: SaleOrderSubmitterComponent;
  let fixture: ComponentFixture<SaleOrderSubmitterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderSubmitterComponent]
    });
    fixture = TestBed.createComponent(SaleOrderSubmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
