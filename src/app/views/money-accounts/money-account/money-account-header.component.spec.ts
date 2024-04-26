/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountHeaderComponent } from './money-account-header.component';

describe('MoneyAccountHeaderComponent', () => {
  let component: MoneyAccountHeaderComponent;
  let fixture: ComponentFixture<MoneyAccountHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoneyAccountHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
