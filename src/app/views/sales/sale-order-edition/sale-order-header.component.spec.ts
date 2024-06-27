/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderHeaderComponent } from './sale-order-header.component';

describe('SaleOrderHeaderComponent', () => {
  let component: SaleOrderHeaderComponent;
  let fixture: ComponentFixture<SaleOrderHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderHeaderComponent]
    });
    fixture = TestBed.createComponent(SaleOrderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
