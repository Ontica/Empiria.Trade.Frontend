/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountTransactionItemsTableComponent } from './money-account-transaction-items-table.component';

describe('MoneyAccountTransactionItemsTableComponent', () => {
  let component: MoneyAccountTransactionItemsTableComponent;
  let fixture: ComponentFixture<MoneyAccountTransactionItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoneyAccountTransactionItemsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountTransactionItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
