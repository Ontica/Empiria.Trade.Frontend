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

import { ReportsControlsModule } from '../reports-controls/reports-controls.module';
import { ProductsModule } from '../products/products.module';

import { ProductImageComponent } from './products-seeker/product-image.component';
import { ProductsFilterComponent } from './products-seeker/products-filter.component';
import { ProductsSeekerComponent } from './products-seeker/products-seeker.component';
import { ProductsSelectorComponent } from './products-selector/products-selector.component';
import { ProductsTableComponent } from './products-seeker/products-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
    ProductsModule,
  ],
  declarations: [
    ProductImageComponent,
    ProductsFilterComponent,
    ProductsSeekerComponent,
    ProductsSelectorComponent,
    ProductsTableComponent,
  ],
  exports: [
    ProductsSeekerComponent,
    ProductsSelectorComponent,
  ],
})
export class InventoryModule { }
