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

import { ProductsFilterComponent } from './products-seeker/products-filter.component';

import { ProductsTableComponent } from './products-seeker/products-table.component';

import { ProductsSeekerComponent } from './products-seeker/products-seeker.component';

import { ProductsSelectorComponent } from './products-selector/products-selector.component';

import { ProductAttributesComponent } from '../products/product-data/product-attributes.component';

import { ProductDataComponent } from '../products/product-data/product-data.component';

import { ProductPresentationsComponent } from '../products/product-data/product-presentations.component';
import { ProductsModule } from '../products/products.module';


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
    ProductsFilterComponent,
    ProductsSeekerComponent,
    ProductsTableComponent,
    ProductsSelectorComponent,
  ],
  exports: [
    ProductsSeekerComponent,
    ProductsSelectorComponent,
  ],
})
export class InventoryModule { }
