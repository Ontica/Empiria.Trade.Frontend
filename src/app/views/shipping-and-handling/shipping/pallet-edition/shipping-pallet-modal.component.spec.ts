/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPalletModalComponent } from './shipping-pallet-modal.component';

describe('ShippingPalletModalComponent', () => {
  let component: ShippingPalletModalComponent;
  let fixture: ComponentFixture<ShippingPalletModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingPalletModalComponent]
    });
    fixture = TestBed.createComponent(ShippingPalletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
