/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountEditorComponent } from './money-account-editor.component';

describe('MoneyAccountEditorComponent', () => {
  let component: MoneyAccountEditorComponent;
  let fixture: ComponentFixture<MoneyAccountEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoneyAccountEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
