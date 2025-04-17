/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { ChildRouteGuard, ParentRouteGuard } from './core';

import { DEFAULT_PATH, MainLayoutComponent, NoContentComponent, ROUTES } from '@app/main-layout';

const routes: Routes = [
  //
  // Temporarily disabled for first production release
  //
  // {
  //   data: { permission: ROUTES.ventas.permission },
  //   path: ROUTES.ventas.path,
  //   component: MainLayoutComponent,
  //   canActivate: [ParentRouteGuard],
  //   canActivateChild: [ChildRouteGuard],
  //   loadChildren: () => import('./workspaces/sales/sales-workspace.module')
  //     .then((m) => m.SalesWorkspaceModule)
  // },

  // {
  //   data: { permission: ROUTES.compras.permission },
  //   path: ROUTES.compras.path,
  //   component: MainLayoutComponent,
  //   canActivate: [ParentRouteGuard],
  //   canActivateChild: [ChildRouteGuard],
  //   loadChildren: () => import('./workspaces/purchases/purchases-workspace.module')
  //     .then((m) => m.PurchasesWorkspaceModule)
  // },
  // {
  //   data: { permission: ROUTES.contabilidad.permission },
  //   path: ROUTES.contabilidad.path,
  //   component: MainLayoutComponent,
  //   canActivate: [ParentRouteGuard],
  //   canActivateChild: [ChildRouteGuard],
  //   loadChildren: () => import('./workspaces/accounting/accounting-workspace.module')
  //     .then((m) => m.AccountingWorkspaceModule)
  // },
  {
    data: { permission: ROUTES.almacenes.permission },
    path: ROUTES.almacenes.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/warehouses/warehouses-workspace.module')
      .then((m) => m.WarehousesWorkspaceModule)
  },
  {
    data: { permission: ROUTES.administracion.permission },
    path: ROUTES.administracion.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/system-management/system-management-workspace.module')
      .then((m) => m.SystemManagementWorkspaceModule)
  },
  {
    path: ROUTES.unauthorized.path,
    canActivate: [ParentRouteGuard],
    component: MainLayoutComponent,
    loadChildren: () => import('./workspaces/system-security/unauthorized.module')
      .then(m => m.UnauthorizedModule)
  },
  {
    path: ROUTES.security.path,
    loadChildren: () => import('./workspaces/system-security/authentication.module')
      .then(m => m.AuthenticationModule)
  },
  { path: '', redirectTo: DEFAULT_PATH, pathMatch: 'full' },
  { path: '**', component: NoContentComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
