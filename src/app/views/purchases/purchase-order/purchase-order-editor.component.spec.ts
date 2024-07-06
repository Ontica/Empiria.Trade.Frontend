/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderEditorComponent } from './purchase-order-editor.component';

describe('PurchaseOrderEditorComponent', () => {
  let component: PurchaseOrderEditorComponent;
  let fixture: ComponentFixture<PurchaseOrderEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseOrderEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
