/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletHeaderComponent } from './pallet-header.component';

describe('PalletHeaderComponent', () => {
  let component: PalletHeaderComponent;
  let fixture: ComponentFixture<PalletHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PalletHeaderComponent]
    });
    fixture = TestBed.createComponent(PalletHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
