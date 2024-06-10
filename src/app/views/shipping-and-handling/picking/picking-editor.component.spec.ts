/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingEditorComponent } from './picking-editor.component';

describe('PickingEditorComponent', () => {
  let component: PickingEditorComponent;
  let fixture: ComponentFixture<PickingEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PickingEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
