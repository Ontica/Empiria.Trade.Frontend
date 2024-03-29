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

import { SalesMainPageComponent } from '@app/views/sales/sales-main-page.component';

import {
  ShippingMainPageComponent
} from '@app/views/shipping-and-handling/shipping/shipping-main-page/shipping-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.almacenes_surtidos.permission },
    path: ROUTES.almacenes_surtidos.path,
    component: SalesMainPageComponent,
  },
  {
    data: { permission: ROUTES.almacenes_embarques.permission },
    path: ROUTES.almacenes_embarques.path,
    component: ShippingMainPageComponent,
  },
  {
    data: { permission: ROUTES.almacenes_inventario.permission },
    path: ROUTES.almacenes_inventario.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.almacenes_almacenamiento.permission },
    path: ROUTES.almacenes_almacenamiento.path,
    component: DefaultComponent,
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
