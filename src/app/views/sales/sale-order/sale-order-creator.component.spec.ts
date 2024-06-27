/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderCreatorComponent } from './sale-order-creator.component';

describe('SaleOrderCreatorComponent', () => {
  let component: SaleOrderCreatorComponent;
  let fixture: ComponentFixture<SaleOrderCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderCreatorComponent]
    });
    fixture = TestBed.createComponent(SaleOrderCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
