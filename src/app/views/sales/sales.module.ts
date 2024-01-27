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

import { OrdersModule } from '../orders/orders.module';
import { ShippingAndHandlingModule } from '../shipping-and-handling/shipping-and-handling.module';

import { SalesMainPageComponent } from './sales-main-page.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,

    OrdersModule,
    ShippingAndHandlingModule,
  ],
  declarations: [
    SalesMainPageComponent,
  ],
  exports: [
    SalesMainPageComponent,
  ]
})
export class SalesModule { }
