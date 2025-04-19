/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './_data-table';



export enum OrdersQueryType {
  Sales              = 'Sales',
  SalesAuthorization = 'SalesAuthorization',
  SalesPacking       = 'SalesPacking',
  SalesShipping      = 'SalesShipping',
  Inventory          = 'Inventory',
  Purchase           = 'Purchase',
}


export interface OrdersTypeConfig {
  type: OrdersQueryType;
  titleText: string;
  itemText: string;
  canAdd?: boolean;
}


export const DefaultOrdersTypeConfig = {
  type: OrdersQueryType.Sales,
  titleText: 'Pedidos',
  itemText: 'pedido',
  canAdd: false,
};


export const DefaultOrdersStatus: string = 'Captured';


export interface OrdersQuery extends DataTableQuery {
  queryType: string;
  keywords: string;
  status: string;
}


export interface OrdersDataTable extends DataTable {
  query: OrdersQuery;
  columns: DataTableColumn[];
  entries: DataTableEntry[];
}


export interface OrdersOperation extends Identifiable {
  uid: string;
  name: string;
}


export interface OrdersOperationCommand {
  operation: Identifiable;
  orders: string[];
}


export const EmptyOrdersQuery: OrdersQuery = {
  queryType: OrdersQueryType.Sales,
  keywords: null,
  status: null,
};


export const EmptyOrdersDataTable: OrdersDataTable = {
  query: EmptyOrdersQuery,
  columns: [],
  entries: [],
};
