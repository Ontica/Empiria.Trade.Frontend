/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountTransactionEditorComponent } from './money-account-transaction-editor.component';

describe('MoneyAccountTransactionEditorComponent', () => {
  let component: MoneyAccountTransactionEditorComponent;
  let fixture: ComponentFixture<MoneyAccountTransactionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoneyAccountTransactionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountTransactionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
