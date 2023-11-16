/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { SalesModule } from '@app/views/sales/sales.module';

import { WarehousesWorkspaceRoutingModule } from './warehouses-workspace-routing.module';


@NgModule({

  imports: [
    SalesModule,
    WarehousesWorkspaceRoutingModule,
  ]

})
export class WarehousesWorkspaceModule { }
