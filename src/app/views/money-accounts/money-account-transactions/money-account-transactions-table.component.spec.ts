/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountTransactionsTableComponent } from './money-account-transactions-table.component';

describe('MoneyAccountTransactionsTableComponent', () => {
  let component: MoneyAccountTransactionsTableComponent;
  let fixture: ComponentFixture<MoneyAccountTransactionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoneyAccountTransactionsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountTransactionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
