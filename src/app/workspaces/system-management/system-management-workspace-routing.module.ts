/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import { ControlPanelMainPageComponent } from './control-panel-main-page/control-panel-main-page.component';

import { DefaultComponent } from '@app/shared/deafult-components/default.component';

import { AccessControlMainPageComponent } from './access-control-main-page/access-control-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.administracion_panel_de_control.permission },
    path: ROUTES.administracion_panel_de_control.path,
    component: ControlPanelMainPageComponent,
  },
  {
    data: { permission: ROUTES.administracion_credito_a_clientes.permission },
    path: ROUTES.administracion_credito_a_clientes.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.administracion_pago_a_proveedores.permission },
    path: ROUTES.administracion_pago_a_proveedores.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.administracion_conciliacion_bancaria.permission },
    path: ROUTES.administracion_conciliacion_bancaria.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.administracion_control_de_accesos.permission },
    path: ROUTES.administracion_control_de_accesos.path,
    component: AccessControlMainPageComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.administracion_panel_de_control.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemManagementWorkspaceRoutingModule { }
