/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderEditorComponent } from './sale-order-editor.component';

describe('SaleOrderEditorComponent', () => {
  let component: SaleOrderEditorComponent;
  let fixture: ComponentFixture<SaleOrderEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderEditorComponent]
    });
    fixture = TestBed.createComponent(SaleOrderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
