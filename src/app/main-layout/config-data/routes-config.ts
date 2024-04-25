/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from "./permissions-config";


export const ROUTES = {

  // #region app-routing module

  ventas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'ventas',
    fullpath: '/ventas',
  },

  compras: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'compras',
    fullpath: '/compras',
  },

  almacenes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'almacenes',
    fullpath: '/almacenes',
  },

  contabilidad: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'contabilidad',
    fullpath: '/contabilidad',
  },

  administracion: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'administracion',
    fullpath: '/administracion',
  },

  security: {
    parent: '',
    path: 'seguridad',
    fullpath: '/seguridad',
  },

  unauthorized: {
    parent: '',
    path: 'no-autorizado',
    fullpath: '/no-autorizado',
  },

  // #endregion

  // #region ventas-routing module

  ventas_pedidos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'ventas',
    path: 'pedidos',
    fullpath: '/ventas/pedidos',
  },

  ventas_autorizaciones: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'ventas',
    path: 'autorizaciones',
    fullpath: '/ventas/autorizaciones',
  },

  ventas_envios: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'ventas',
    path: 'envios',
    fullpath: '/ventas/envios',
  },

  ventas_cuentas_x_cobrar: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'ventas',
    path: 'cuentas-x-cobrar',
    fullpath: '/ventas/cuentas-x-cobrar',
  },

  ventas_facturacion: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'ventas',
    path: 'facturacion',
    fullpath: '/ventas/facturacion',
  },

  //#endregion

  // #region compras-routing module

  compras_ordenes_de_compra: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'compras',
    path: 'ordenes-de-compra',
    fullpath: '/compras/ordenes-de-compra',
  },

  compras_cuentas_x_pagar: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'compras',
    path: 'cuentas-x-pagar',
    fullpath: '/compras/cuentas-x-pagar',
  },

  //#endregion

  // #region almacenes-routing module

  almacenes_surtidos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'almacenes',
    path: 'surtidos',
    fullpath: '/almacenes/surtidos',
  },

  almacenes_embarques: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'almacenes',
    path: 'embarques',
    fullpath: '/almacenes/embarques',
  },

  almacenes_inventario: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'almacenes',
    path: 'inventario',
    fullpath: '/almacenes/inventario',
  },

  almacenes_almacenamiento: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'almacenes',
    path: 'almacenamiento',
    fullpath: '/almacenes/almacenamiento',
  },

  //#endregion

  // #region contabilidad-routing module

  contabilidad_polizas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'contabilidad',
    path: 'polizas',
    fullpath: '/contabilidad/polizas',
  },

  contabilidad_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'contabilidad',
    path: 'reportes',
    fullpath: '/contabilidad/reportes',
  },

  contabilidad_catalogo_de_cuentas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'contabilidad',
    path: 'catalogo-de-cuentas',
    fullpath: '/contabilidad/catalogo-de-cuentas',
  },

  contabilidad_auxiliares: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'contabilidad',
    path: 'auxiliares',
    fullpath: '/contabilidad/auxiliares',
  },

  //#endregion

  // #region system-management-routing module

  administracion_panel_de_control: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'administracion',
    path: 'panel-de-control',
    fullpath: '/administracion/panel-de-control',
  },

  administracion_cuentas_y_cajas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'administracion',
    path: 'cuentas-y-cajas',
    fullpath: '/administracion/cuentas-y-cajas',
  },

  administracion_credito_a_clientes: {
    permission: PERMISSIONS.BLOCKED,
    parent: 'administracion',
    path: 'credito-a-clientes',
    fullpath: '/administracion/credito-a-clientes',
  },

  administracion_pago_a_proveedores: {
    permission: PERMISSIONS.BLOCKED,
    parent: 'administracion',
    path: 'pago-a-proveedores',
    fullpath: '/administracion/pago-a-proveedores',
  },

  administracion_conciliacion_bancaria: {
    permission: PERMISSIONS.BLOCKED,
    parent: 'administracion',
    path: 'conciliacion-bancaria',
    fullpath: '/administracion/conciliacion-bancaria',
  },

  administracion_control_de_accesos: {
    permission: PERMISSIONS.ALL,
    parent: 'administracion',
    path: 'control-de-accesos',
    fullpath: '/administracion/control-de-accesos',
  },

  // #endregion

  // #region security-routing module

  security_login: {
    parent: 'seguridad',
    path: 'login',
    fullpath: '/seguridad/login'
  },

  // #endregion

};


export const DEFAULT_ROUTE = ROUTES.administracion_panel_de_control;


export const DEFAULT_PATH = DEFAULT_ROUTE.fullpath;


export const LOGIN_PATH = ROUTES.security_login.fullpath;


export const UNAUTHORIZED_PATH = ROUTES.unauthorized.path;


export const ROUTES_LIST = Object.keys(ROUTES)
                                 .map(key => ROUTES[key])
                                 .filter(x => x.parent && x.permission);
