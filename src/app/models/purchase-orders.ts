/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DataTableEntry } from "./_data-table";

import { OrdersQuery, OrdersOperation } from "./orders";


export enum PurchaseOrdersQueryType {
  Purchase = 'Purchase',
}


export enum PurchaseOrdersOperationType {
  cancel = 'cancel',
  print  = 'print',
}


export interface PurchaseOrdersQuery extends OrdersQuery {
  queryType: string;
  keywords: string;
  status: string;
  supplierUID: string;
}


export interface PurchaseOrderDescriptor extends DataTableEntry {
  uid: string;
  orderNumber: string;
  supplierName: string;
  status: string;
  statusName: string;
}


export const PurchaseOrdersOperationsList: OrdersOperation[] = [
  { uid: PurchaseOrdersOperationType.print, name: 'Imprimir' },
  { uid: PurchaseOrdersOperationType.cancel, name: 'Cancelar' },
];


export const EmptyPurchaseOrdersQuery: PurchaseOrdersQuery = {
  queryType: PurchaseOrdersQueryType.Purchase,
  keywords: null,
  status: null,
  supplierUID: null,
};
