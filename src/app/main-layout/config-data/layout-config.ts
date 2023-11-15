/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES } from '../config-data';

import { View, Layout } from '../common-models/common';

import {
  VentasViews,
  ComprasViews,
  AlmacenesViews,
  ContabilidadViews,
  AdministracionSistemaViews,
  UnauthorizedViews,
} from './views-config';


export const APP_VIEWS: View[] = VentasViews.concat(ComprasViews,
                                                    AlmacenesViews,
                                                    ContabilidadViews,
                                                    AdministracionSistemaViews,
                                                    UnauthorizedViews);


export const APP_LAYOUTS: Layout[] = [
  {
    name: 'Ventas',
    views: VentasViews,
    hint: 'Ventas',
    defaultTitle: 'Ventas',
    url: ROUTES.ventas.fullpath,
    permission: ROUTES.ventas.permission,
  },
  {
    name: 'Almacenes',
    views: AlmacenesViews,
    hint: 'Almacenes',
    defaultTitle: 'Almacenes',
    url: ROUTES.almacenes.fullpath,
    permission: ROUTES.almacenes.permission,
  },
  {
    name: 'Compras',
    views: ComprasViews,
    hint: 'Compras',
    defaultTitle: 'Compras',
    url: ROUTES.compras.fullpath,
    permission: ROUTES.compras.permission,
  },
  {
    name: 'Contabilidad',
    views: ContabilidadViews,
    hint: 'Contabilidad',
    defaultTitle: 'Contabilidad',
    url: ROUTES.contabilidad.fullpath,
    permission: ROUTES.contabilidad.permission,
  },
  {
    name: 'Administración',
    views: AdministracionSistemaViews,
    hint: 'Administración del sistema',
    defaultTitle: 'Administración',
    url: ROUTES.administracion.fullpath,
    permission: ROUTES.administracion.permission,
  },
  {
    name: 'Unauthorized',
    views: UnauthorizedViews,
    hint: '',
    defaultTitle: '401: Unauthorized',
    url: ROUTES.unauthorized.fullpath,
  },
];
