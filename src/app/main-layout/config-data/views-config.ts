/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES } from './routes-config';

import { View } from '../common-models/common';


export const VentasViews: View[] = [
  {
    name: 'VentasViews.Pedidos',
    title: 'Pedidos',
    url: ROUTES.ventas_pedidos.fullpath,
    permission: ROUTES.ventas_pedidos.permission
  },
  {
    name: 'VentasViews.Autorizaciones',
    title: 'Autorizaciones',
    url: ROUTES.ventas_autorizaciones.fullpath,
    permission: ROUTES.ventas_autorizaciones.permission
  },
  {
    name: 'VentasViews.Envios',
    title: 'Envíos',
    url: ROUTES.ventas_envios.fullpath,
    permission: ROUTES.ventas_envios.permission
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


export const AlmacenesViews: View[] = [
  {
    name: 'AlmacenesViews.Surtidos',
    title: 'Surtidos',
    url: ROUTES.almacenes_surtidos.fullpath,
    permission: ROUTES.almacenes_surtidos.permission,
  },
  {
    name: 'AlmacenesViews.Embarques',
    title: 'Embarques',
    url: ROUTES.almacenes_embarques.fullpath,
    permission: ROUTES.almacenes_embarques.permission,
  },
  {
    name: 'AlmacenesViews.Inventario',
    title: 'Inventario',
    url: ROUTES.almacenes_inventario.fullpath,
    permission: ROUTES.almacenes_inventario.permission,
  },
  {
    name: 'AlmacenesViews.Almacenamiento',
    title: 'Almacenamiento',
    url: ROUTES.almacenes_almacenamiento.fullpath,
    permission: ROUTES.almacenes_almacenamiento.permission
  },
  {
    name: 'AlmacenesViews.Reportes',
    title: 'Reportes',
    url: ROUTES.almacenes_reportes.fullpath,
    permission: ROUTES.almacenes_reportes.permission
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
    name: 'AdministracionSistemaViews.CuentasYCajas',
    title: 'Cuentas y cajas',
    url: ROUTES.administracion_cuentas_y_cajas.fullpath,
    permission: ROUTES.administracion_cuentas_y_cajas.permission,
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
