/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingViewComponent } from './packing-view.component';

describe('PackingViewComponent', () => {
  let component: PackingViewComponent;
  let fixture: ComponentFixture<PackingViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackingViewComponent]
    });
    fixture = TestBed.createComponent(PackingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
