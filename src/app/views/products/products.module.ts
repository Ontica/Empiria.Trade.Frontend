/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';

import { SharedModule } from '@app/shared/shared.module';

import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { ProductAttributesComponent } from './product-data/product-attributes.component';
import { ProductDataComponent } from './product-data/product-data.component';
import { ProductImageComponent } from './product-data/product-image.component';
import { ProductPresentationsComponent } from './product-data/product-presentations.component';
import { ProductLocationComponent } from './product-data/product-location.component';
import { ProductInputComponent } from './product-data/product-input.component';

import { ProductsSeekerComponent } from './products-seeker/products-seeker.component';
import { ProductsFilterComponent } from './products-seeker/products-filter.component';
import { ProductsTableComponent } from './products-seeker/products-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
  ],
  declarations: [
    ProductAttributesComponent,
    ProductDataComponent,
    ProductImageComponent,
    ProductPresentationsComponent,
    ProductLocationComponent,
    ProductInputComponent,

    ProductsSeekerComponent,
    ProductsFilterComponent,
    ProductsTableComponent,
  ],
  exports: [
    ProductAttributesComponent,
    ProductImageComponent,
    ProductsSeekerComponent,
  ]
})
export class ProductsModule { }
