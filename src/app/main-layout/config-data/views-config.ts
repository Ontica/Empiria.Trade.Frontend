/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from './permissions-config';

import { ROUTES } from './routes-config';

import { View } from '../common-models/common';


export const VentasViews: View[] = [
  {
    name: 'VentasViews.Pedidos',
    title: 'Pedidos',
    url: ROUTES.ventas_pedidos.fullpath,
    permission: ROUTES.ventas_pedidos.permission,
    actions: [
      { action: 'ActionExport', name: 'Exportar', permission: PERMISSIONS.NOT_REQUIRED },
      { action: 'ActionCreate', name: 'Agregar', permission: PERMISSIONS.NOT_REQUIRED },
    ]
  },
  {
    name: 'VentasViews.CuentasXCobrar',
    title: 'Cuentas x cobrar',
    url: ROUTES.ventas_cuentas_x_cobrar.fullpath,
    permission: ROUTES.ventas_cuentas_x_cobrar.permission
  },
  {
    name: 'VentasViews.Facturacion',
    title: 'Facturación',
    url: ROUTES.ventas_facturacion.fullpath,
    permission: ROUTES.ventas_facturacion.permission
  },
];


export const ComprasViews: View[] = [
  {
    name: 'ComprasViews.OrdenesDeCompra',
    title: 'Ordenes de compra',
    url: ROUTES.compras_ordenes_de_compra.fullpath,
    permission: ROUTES.compras_ordenes_de_compra.permission,
  },
  {
    name: 'ComprasViews.CuentasXPagar',
    title: 'Cuentas x pagar',
    url: ROUTES.compras_cuentas_x_pagar.fullpath,
    permission: ROUTES.compras_cuentas_x_pagar.permission
  },
];


export const InventariosViews: View[] = [
  {
    name: 'InventariosViews.Inventario',
    title: 'Inventario',
    url: ROUTES.inventarios_inventario.fullpath,
    permission: ROUTES.inventarios_inventario.permission,
  },
  {
    name: 'InventariosViews.Almacenes',
    title: 'Almacenes',
    url: ROUTES.inventarios_almacenes.fullpath,
    permission: ROUTES.inventarios_almacenes.permission
  },
];


export const ContabilidadViews: View[] = [
  {
    name: 'ContabilidadViews.Polizas',
    title: 'Pólizas',
    url: ROUTES.contabilidad_polizas.fullpath,
    permission: ROUTES.contabilidad_polizas.permission,
  },
  {
    name: 'ContabilidadViews.Reportes',
    title: 'Reportes',
    url: ROUTES.contabilidad_reportes.fullpath,
    permission: ROUTES.contabilidad_reportes.permission
  },
  {
    name: 'ContabilidadViews.Catalogo_De_Cuentas',
    title: 'Catálogo de cuentas',
    url: ROUTES.contabilidad_catalogo_de_cuentas.fullpath,
    permission: ROUTES.contabilidad_catalogo_de_cuentas.permission
  },
  {
    name: 'ContabilidadViews.Auxiliares',
    title: 'Auxiliares',
    url: ROUTES.contabilidad_auxiliares.fullpath,
    permission: ROUTES.contabilidad_auxiliares.permission
  },
];


export const AdministracionSistemaViews: View[] = [
  {
    name: 'AdministracionSistemaViews.PanelControl',
    title: 'Panel de control',
    url: ROUTES.administracion_panel_de_control.fullpath,
    permission: ROUTES.administracion_panel_de_control.permission,
  },
  {
    name: 'AdministracionSistemaViews.CreditoClientes',
    title: 'Crédito a clientes',
    url: ROUTES.administracion_credito_a_clientes.fullpath,
    permission: ROUTES.administracion_credito_a_clientes.permission,
  },
  {
    name: 'AdministracionSistemaViews.PagoProveedores',
    title: 'Pago a Proveedores',
    url: ROUTES.administracion_pago_a_proveedores.fullpath,
    permission: ROUTES.administracion_pago_a_proveedores.permission,
  },
  {
    name: 'AdministracionSistemaViews.ConciliacionBancaria',
    title: 'Conciliación Bancaria',
    url: ROUTES.administracion_conciliacion_bancaria.fullpath,
    permission: ROUTES.administracion_conciliacion_bancaria.permission,
  },
  {
    name: 'AccountingSystemManagementViews.ControlAccesos',
    title: 'Control de accesos',
    url: ROUTES.administracion_control_de_accesos.fullpath,
    permission: ROUTES.administracion_control_de_accesos.permission,
  },
];


export const UnauthorizedViews: View[] = [
  {
    name: 'Unauthorized',
    title: '',
    url: ROUTES.unauthorized.fullpath,
  },
];
