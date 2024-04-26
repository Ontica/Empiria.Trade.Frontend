/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountCreatorComponent } from './money-account-creator.component';

describe('MoneyAccountCreatorComponent', () => {
  let component: MoneyAccountCreatorComponent;
  let fixture: ComponentFixture<MoneyAccountCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoneyAccountCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
