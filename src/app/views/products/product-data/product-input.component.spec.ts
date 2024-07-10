/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInputComponent } from './product-input.component';

describe('ProductInputComponent', () => {
  let component: ProductInputComponent;
  let fixture: ComponentFixture<ProductInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
