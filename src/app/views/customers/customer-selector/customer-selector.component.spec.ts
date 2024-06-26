/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSelectorComponent } from './customer-selector.component';


describe('CustomerSelectorComponent', () => {
  let component: CustomerSelectorComponent;
  let fixture: ComponentFixture<CustomerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
