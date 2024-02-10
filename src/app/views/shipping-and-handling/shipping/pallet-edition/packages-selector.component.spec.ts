/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesSelectorComponent } from './packages-selector.component';

describe('PackagesSelectorComponent', () => {
  let component: PackagesSelectorComponent;
  let fixture: ComponentFixture<PackagesSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackagesSelectorComponent]
    });
    fixture = TestBed.createComponent(PackagesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
