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

import { ProductAttributesComponent } from './product-data/product-attributes.component';

import { ProductDataComponent } from './product-data/product-data.component';

import { ProductPresentationsComponent } from './product-data/product-presentations.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    ProductAttributesComponent,
    ProductDataComponent,
    ProductPresentationsComponent,
  ],
  exports: [
    ProductAttributesComponent,
    ProductDataComponent,
    ProductPresentationsComponent,
  ]
})
export class ProductsModule { }
