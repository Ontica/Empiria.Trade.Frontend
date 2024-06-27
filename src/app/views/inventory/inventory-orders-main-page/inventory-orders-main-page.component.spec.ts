/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrdersMainPageComponent } from './inventory-orders-main-page.component';

describe('InventoryOrdersMainPageComponent', () => {
  let component: InventoryOrdersMainPageComponent;
  let fixture: ComponentFixture<InventoryOrdersMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryOrdersMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrdersMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
