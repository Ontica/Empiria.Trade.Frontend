/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { WarehousesWorkspaceRoutingModule } from './warehouses-workspace-routing.module';

import { InventoryModule } from '@app/views/inventory/inventory.module';
import { SalesModule } from '@app/views/sales/sales.module';
import { ShippingAndHandlingModule } from '@app/views/shipping-and-handling/shipping-and-handling.module';

import {
  InventoryOrdersMainPageComponent
} from './inventory-orders-main-page/inventory-orders-main-page.component';


@NgModule({

  imports: [
    WarehousesWorkspaceRoutingModule,

    InventoryModule,
    SalesModule,
    ShippingAndHandlingModule,
  ],

  declarations: [
    InventoryOrdersMainPageComponent,
  ],

})
export class WarehousesWorkspaceModule { }
