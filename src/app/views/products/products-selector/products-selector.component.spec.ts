/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSelectorComponent } from './products-selector.component';

describe('ProductsSelectorComponent', () => {
  let component: ProductsSelectorComponent;
  let fixture: ComponentFixture<ProductsSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsSelectorComponent]
    });
    fixture = TestBed.createComponent(ProductsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
