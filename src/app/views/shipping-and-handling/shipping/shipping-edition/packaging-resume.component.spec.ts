/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingResumeComponent } from './packaging-resume.component';

describe('PackagingResumeComponent', () => {
  let component: PackagingResumeComponent;
  let fixture: ComponentFixture<PackagingResumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackagingResumeComponent]
    });
    fixture = TestBed.createComponent(PackagingResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
