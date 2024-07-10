/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTableEntry } from './_data-table';

import { OrdersQuery, OrdersOperation } from './orders';

import { PurchaseProductSelection } from './product';


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

  vendorProductUID: string;
  productCode: string;
  productName: string;
  presentationName: string;

  quantity: number;
  price: number;
  weight: number;
  total: number;

  notes: string;
}


export interface PurchaseOrderTotals {
  itemsCount: number;
  orderTotal: number;
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


export interface PurchaseOrderItemFields {
  vendorProductUID: string;
  quantity: number;
  price: number;
  weight: number;
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


export const EmptyPurchaseOrderTotals: PurchaseOrderTotals = {
  itemsCount: 0,
  orderTotal: 0,
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


export function mapPurchaseOrderItemFieldsFromSelection(
  item: PurchaseProductSelection): PurchaseOrderItemFields {
  const itemFields: PurchaseOrderItemFields = {
    vendorProductUID: item.vendor.vendorProductUID ?? null,
    quantity: item.quantity ?? null,
    price: item.price ?? null,
    weight: item.weight ?? null,
    notes: item.notes ?? null,
  };

  return itemFields;
}
