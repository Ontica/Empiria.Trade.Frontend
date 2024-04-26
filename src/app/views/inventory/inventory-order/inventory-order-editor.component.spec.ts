/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderEditorComponent } from './inventory-order-editor.component';

describe('InventoryOrderEditorComponent', () => {
  let component: InventoryOrderEditorComponent;
  let fixture: ComponentFixture<InventoryOrderEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryOrderEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
