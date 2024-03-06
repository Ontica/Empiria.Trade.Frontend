/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingMainPageComponent } from './shipping-main-page.component';

describe('ShippingMainPageComponent', () => {
  let component: ShippingMainPageComponent;
  let fixture: ComponentFixture<ShippingMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingMainPageComponent]
    });
    fixture = TestBed.createComponent(ShippingMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
