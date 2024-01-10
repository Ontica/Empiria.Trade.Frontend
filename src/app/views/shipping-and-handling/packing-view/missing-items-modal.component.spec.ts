/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingItemsModalComponent } from './missing-items-modal.component';

describe('MissingItemsModalComponent', () => {
  let component: MissingItemsModalComponent;
  let fixture: ComponentFixture<MissingItemsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissingItemsModalComponent]
    });
    fixture = TestBed.createComponent(MissingItemsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
