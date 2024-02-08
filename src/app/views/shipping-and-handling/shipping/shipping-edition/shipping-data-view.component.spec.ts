/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingDataViewComponent } from './shipping-data-view.component';

describe('ShippingDataViewComponent', () => {
  let component: ShippingDataViewComponent;
  let fixture: ComponentFixture<ShippingDataViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingDataViewComponent]
    });
    fixture = TestBed.createComponent(ShippingDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
