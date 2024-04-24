/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';


import { ProductsModule } from '../products/products.module';

import { ProductsSeekerToolComponent } from './products-seeker-tool.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,

    ProductsModule,
  ],
  declarations: [
    ProductsSeekerToolComponent,
  ],
  exports: [
    ProductsSeekerToolComponent,
  ],
})
export class ToolsModule { }
