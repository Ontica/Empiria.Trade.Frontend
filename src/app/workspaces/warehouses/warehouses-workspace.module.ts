/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { WarehousesWorkspaceRoutingModule } from './warehouses-workspace-routing.module';
import { InventoryModule } from '@app/views/inventory/inventory.module';
import { SalesModule } from '@app/views/sales/sales.module';
import { ShippingAndHandlingModule } from '@app/views/shipping-and-handling/shipping-and-handling.module';


@NgModule({

  imports: [
    CommonModule,

    SharedModule,

    WarehousesWorkspaceRoutingModule,
    InventoryModule,
    SalesModule,
    ShippingAndHandlingModule,
  ],

})
export class WarehousesWorkspaceModule { }
