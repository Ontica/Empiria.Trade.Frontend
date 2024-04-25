/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountsExplorerComponent } from './money-accounts-explorer.component';

describe('MoneyAccountsExplorerComponent', () => {
  let component: MoneyAccountsExplorerComponent;
  let fixture: ComponentFixture<MoneyAccountsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyAccountsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
