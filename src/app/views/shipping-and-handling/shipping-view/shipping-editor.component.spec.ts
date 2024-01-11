/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingEditorComponent } from './shipping-editor.component';

describe('ShippingEditorComponent', () => {
  let component: ShippingEditorComponent;
  let fixture: ComponentFixture<ShippingEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingEditorComponent]
    });
    fixture = TestBed.createComponent(ShippingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
