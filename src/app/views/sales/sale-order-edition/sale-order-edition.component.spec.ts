/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderEditionComponent } from './sale-order-edition.component';

describe('SaleOrderEditionComponent', () => {
  let component: SaleOrderEditionComponent;
  let fixture: ComponentFixture<SaleOrderEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderEditionComponent]
    });
    fixture = TestBed.createComponent(SaleOrderEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
