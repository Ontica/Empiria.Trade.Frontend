/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { SalesModule } from '@app/views/sales/sales.module';

import { SalesWorkspaceRoutingModule } from './sales-workspace-routing.module';

import { ShippingAndHandlingModule } from '@app/views/shipping-and-handling/shipping-and-handling.module';

import { ShippingMainPageComponent } from './shipping-main-page/shipping-main-page.component';


@NgModule({

  imports: [
    CommonModule,
    SharedModule,

    SalesWorkspaceRoutingModule,
    SalesModule,
    ShippingAndHandlingModule,
  ],

  declarations: [
    ShippingMainPageComponent,
  ]

})
export class SalesWorkspaceModule { }
