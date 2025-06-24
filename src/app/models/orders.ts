/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './_data-table';

import { EntityStatus } from './_explorer-data';


export enum OrderEntriesStatus {
  Abierto   = 'Abierto',
  EnProceso = 'EnProceso',
  Cerrado   = 'Cerrado',
}


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
  orderTypeUID?: string;
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


export interface OrderHolder {
  order: Order;
  items: OrderItem[];
  actions: OrderActions;
}


export interface Order {
  uid: string;
  orderType: Identifiable;
  orderNo: string;
  description: string;
  responsible: Identifiable;
  closingTime: DateString;
  postingTime: DateString;
  postedBy: Identifiable;
  status: Identifiable<EntityStatus>;
}


export interface OrderItem {
  uid: string;
  productName: string;
  quantity: number;
  assignedQuantity: number;
  entries: OrderItemEntry[];
}


export interface OrderItemEntry {
  uid: string;
}


export interface OrderActions {
  canEdit: boolean;
  canEditItems: boolean;
  canEditEntries: boolean;
  canDelete: boolean;
  canClose: boolean;
  canOpen: boolean;
}


export const EmptyOrder: Order = {
  uid: '',
  orderType: Empty,
  orderNo: '',
  responsible: Empty,
  description: '',
  closingTime: '',
  postingTime: '',
  postedBy: Empty,
  status: null,
};


export const EmptyOrderActions: OrderActions = {
  canEdit: false,
  canEditItems: false,
  canEditEntries: false,
  canDelete: false,
  canClose: false,
  canOpen: false,
};


export const EmptyOrderHolder: OrderHolder = {
  order: EmptyOrder,
  items: [],
  actions: EmptyOrderActions,
};


export const EmptyOrderItem: OrderItem = {
  uid: '',
  productName: '',
  quantity: null,
  assignedQuantity: null,
  entries: [],
}
