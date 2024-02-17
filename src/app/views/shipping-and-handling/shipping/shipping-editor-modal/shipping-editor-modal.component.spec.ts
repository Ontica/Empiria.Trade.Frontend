/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingEditorModalComponent } from './shipping-editor-modal.component';

describe('ShippingEditorModalComponent', () => {
  let component: ShippingEditorModalComponent;
  let fixture: ComponentFixture<ShippingEditorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingEditorModalComponent]
    });
    fixture = TestBed.createComponent(ShippingEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
