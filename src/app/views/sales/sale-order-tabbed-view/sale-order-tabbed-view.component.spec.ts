/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderTabbedViewComponent } from './sale-order-tabbed-view.component';

describe('SaleOrderTabbedViewComponent', () => {
  let component: SaleOrderTabbedViewComponent;
  let fixture: ComponentFixture<SaleOrderTabbedViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderTabbedViewComponent]
    });
    fixture = TestBed.createComponent(SaleOrderTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
