/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderItemEditorComponent } from './inventory-order-item-editor.component';

describe('InventoryOrderItemEditorComponent', () => {
  let component: InventoryOrderItemEditorComponent;
  let fixture: ComponentFixture<InventoryOrderItemEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryOrderItemEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
