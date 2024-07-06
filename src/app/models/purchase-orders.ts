/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTableEntry } from './_data-table';

import { OrdersQuery, OrdersOperation } from './orders';


export enum PurchaseOrdersQueryType {
  Purchase = 'Purchase',
}


export enum PurchaseStatus {
  Captured   = 'Captured',
  InProgress = 'InProgress',
  Closed     = 'Closed',
  Cancelled = 'Cancelled',
}


export const PurchaseStatusList: Identifiable[] = [
  { uid: PurchaseStatus.Captured,   name: 'Abierto' },
  { uid: PurchaseStatus.InProgress, name: 'En proceso' },
  { uid: PurchaseStatus.Closed,     name: 'Cerrado' },
  { uid: PurchaseStatus.Cancelled,  name: 'Cancelado' },
];


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


export interface PurchaseOrder {
  uid: string;
  orderNumber: string;
  supplier: Identifiable;
  paymentCondition: string;
  shippingMethod: string;
  notes: string;
  status: Identifiable;
  orderTime: DateString;
  scheduledTime: DateString;
  receptionTime: DateString;
  items: PurchaseOrderItem[];
  totals: PurchaseOrderTotals;
  actions: PurchaseOrderActions;
}


export interface PurchaseOrderItem {
  uid: string;
}


export interface PurchaseOrderTotals {

}


export interface PurchaseOrderActions {
  canEdit: boolean;
  canDelete: boolean;
  canClose: boolean;
  canOpen: boolean;
}


export interface PurchaseOrderFields {
  supplierUID: string;
  paymentCondition: string;
  shippingMethod: string;
  scheduledTime: DateString;
  notes: string;
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


export const EmptyPurchaseOrderActions: PurchaseOrderActions = {
  canEdit: false,
  canDelete: false,
  canClose: false,
  canOpen: false,
};


export const EmptyPurchaseOrder: PurchaseOrder = {
  uid: '',
  orderNumber: '',
  supplier: Empty,
  paymentCondition: '',
  shippingMethod: '',
  notes: '',
  status: Empty,
  orderTime: '',
  scheduledTime: '',
  receptionTime: '',
  items: [],
  totals: null,
  actions: EmptyPurchaseOrderActions,
};
