/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAccountTabbedViewComponent } from './money-account-tabbed-view.component';

describe('MoneyAccountTabbedViewComponent', () => {
  let component: MoneyAccountTabbedViewComponent;
  let fixture: ComponentFixture<MoneyAccountTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoneyAccountTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAccountTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
