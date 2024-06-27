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
  SalesOrdersMainPageComponent
} from '@app/views/sales/sales-orders-main-page/sales-orders-main-page.component';

import {
  ShippingMainPageComponent
} from '@app/views/shipping-and-handling/shipping/shipping-main-page/shipping-main-page.component';



const routes: Routes = [
  {
    data: { permission: ROUTES.ventas_pedidos.permission },
    path: ROUTES.ventas_pedidos.path,
    component: SalesOrdersMainPageComponent,
  },
  {
    data: { permission: ROUTES.ventas_autorizaciones.permission },
    path: ROUTES.ventas_autorizaciones.path,
    component: SalesOrdersMainPageComponent,
  },
  {
    data: { permission: ROUTES.ventas_envios.permission },
    path: ROUTES.ventas_envios.path,
    component: ShippingMainPageComponent,
  },
  {
    data: { permission: ROUTES.ventas_cuentas_x_cobrar.permission },
    path: ROUTES.ventas_cuentas_x_cobrar.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.ventas_facturacion.permission },
    path: ROUTES.ventas_facturacion.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.ventas_pedidos.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesWorkspaceRoutingModule { }
