/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountTransactionsEditionComponent } from './money-account-transactions-edition.component';

describe('MoneyAccountTransactionsEditionComponent', () => {
  let component: MoneyAccountTransactionsEditionComponent;
  let fixture: ComponentFixture<MoneyAccountTransactionsEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoneyAccountTransactionsEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountTransactionsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
