/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountsMainPageComponent } from './money-accounts-main-page.component';

describe('MoneyAccountsMainPageComponent', () => {
  let component: MoneyAccountsMainPageComponent;
  let fixture: ComponentFixture<MoneyAccountsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyAccountsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
