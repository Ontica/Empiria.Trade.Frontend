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


const routes: Routes = [
  {
    data: { permission: ROUTES.contabilidad_polizas.permission },
    path: ROUTES.contabilidad_polizas.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.contabilidad_reportes.permission },
    path: ROUTES.contabilidad_reportes.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.contabilidad_catalogo_de_cuentas.permission },
    path: ROUTES.contabilidad_catalogo_de_cuentas.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.contabilidad_auxiliares.permission },
    path: ROUTES.contabilidad_auxiliares.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.contabilidad_polizas.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingWorkspaceRoutingModule { }
