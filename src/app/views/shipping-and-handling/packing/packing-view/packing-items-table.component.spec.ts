/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingItemsTableComponent } from './packing-items-table.component';

describe('PackingItemsTableComponent', () => {
  let component: PackingItemsTableComponent;
  let fixture: ComponentFixture<PackingItemsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackingItemsTableComponent]
    });
    fixture = TestBed.createComponent(PackingItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
