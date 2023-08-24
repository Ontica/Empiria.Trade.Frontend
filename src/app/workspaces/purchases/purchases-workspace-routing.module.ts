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
    data: { permission: ROUTES.compras_ordenes_de_compra.permission },
    path: ROUTES.compras_ordenes_de_compra.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.compras_cuentas_x_pagar.permission },
    path: ROUTES.compras_cuentas_x_pagar.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.compras_ordenes_de_compra.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesWorkspaceRoutingModule { }
