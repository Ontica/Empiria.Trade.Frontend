/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsLocationSelectorComponent } from './products-location-selector.component';

describe('ProductsLocationSelectorComponent', () => {
  let component: ProductsLocationSelectorComponent;
  let fixture: ComponentFixture<ProductsLocationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsLocationSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsLocationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
