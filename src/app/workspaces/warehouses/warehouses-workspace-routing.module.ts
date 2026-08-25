/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import { DefaultComponent } from '@app/shared/components/default-component/default.component';

import {
  InventoryOrdersMainPageComponent
} from '@app/views/inventory/inventory-orders-main-page/inventory-orders-main-page.component';

import {
  SalesOrdersMainPageComponent
} from '@app/views/sales/sales-orders-main-page/sales-orders-main-page.component';

import {
  ShippingMainPageComponent
} from '@app/views/shipping-and-handling/shipping/shipping-main-page/shipping-main-page.component';

import { ReportBuilderComponent } from '@app/views/reporting/report-builder/report-builder.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.almacenes_surtidos.permission },
    path: ROUTES.almacenes_surtidos.path,
    component: SalesOrdersMainPageComponent,
  },
  {
    data: { permission: ROUTES.almacenes_embarques.permission },
    path: ROUTES.almacenes_embarques.path,
    component: ShippingMainPageComponent,
  },
  {
    data: { permission: ROUTES.almacenes_inventario.permission },
    path: ROUTES.almacenes_inventario.path,
    component: InventoryOrdersMainPageComponent,
  },
  {
    data: { permission: ROUTES.almacenes_almacenamiento.permission },
    path: ROUTES.almacenes_almacenamiento.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.almacenes_reportes.permission },
    path: ROUTES.almacenes_reportes.path,
    component: ReportBuilderComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.almacenes_surtidos.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehousesWorkspaceRoutingModule { }
