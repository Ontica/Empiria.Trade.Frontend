/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import { DefaultComponent } from '@app/shared/deafult-components/default.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.inventarios_inventario.permission },
    path: ROUTES.inventarios_inventario.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.inventarios_almacenes.permission },
    path: ROUTES.inventarios_almacenes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.inventarios_inventario.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryWorkspaceRoutingModule { }
