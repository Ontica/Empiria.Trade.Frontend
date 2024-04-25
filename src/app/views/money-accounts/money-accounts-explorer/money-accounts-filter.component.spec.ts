/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountsFilterComponent } from './money-accounts-filter.component';

describe('MoneyAccountsFilterComponent', () => {
  let component: MoneyAccountsFilterComponent;
  let fixture: ComponentFixture<MoneyAccountsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyAccountsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
