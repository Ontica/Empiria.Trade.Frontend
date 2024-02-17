/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingEditionComponent } from './shipping-edition.component';

describe('ShippingEditionComponent', () => {
  let component: ShippingEditionComponent;
  let fixture: ComponentFixture<ShippingEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingEditionComponent]
    });
    fixture = TestBed.createComponent(ShippingEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
