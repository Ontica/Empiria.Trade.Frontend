/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTableEntry } from './_data-table';

import { InventoryProductSelection } from './product';

import { EmptyOrderActions, Order, OrderActions, OrdersQuery } from './orders';

import { EntityStatus } from './_explorer-data';


export interface InventoryOrdersQuery extends OrdersQuery {
  status: string;
  keywords: string;
  // inventoryOrderTypeUID: string;
  // assignedToUID: string;
}


export interface InventoryOrderDescriptor extends DataTableEntry {
  uid: string;
  orderTypeName: string;
  orderNo: string;
  responsibleName: string;
  postingTime: DateString;
  description: string;
  status: string;
  // assignedToName: string;
}


export interface InventoryOrder extends Order {
  uid: string;
  orderType: Identifiable;
  orderNo: string;
  responsible: Identifiable;
  assignedTo: Identifiable;
  description: string;
  closingTime: DateString;
  postingTime: DateString;
  postedBy: Identifiable;
  status: Identifiable<EntityStatus>;
  items: InventoryOrderItem[];
  actions: OrderActions;
}


export interface InventoryPicking extends Order {
  orderType: Identifiable;
  orderNo: string;
  responsible: Identifiable;
  assignedTo: Identifiable;
  description: string;
}


export interface InventoryOrderFields {
  inventoryOrderTypeUID: string;
  responsibleUID: string;
  description: string;
  assignedToUID: string;
}


export interface InventoryOrderItem {
  uid: string;
  product: InventoryProduct;
  warehouseBin: InventoryWarehouseBin;
  quantity: number;
  description: string;
}


export interface InventoryProduct {
  productCode: string;
  productDescription: string;
  presentation: string;
}


export interface InventoryWarehouseBin {
  rack: string;
  rackDescription: string;
}


export interface InventoryOrderItemFields {
  vendorProductUID: string;
  warehouseBinUID: string;
  quantity: number;
  description: string;
}


export const EmptyInventoryOrdersQuery: InventoryOrdersQuery = {
  queryType: '',
  status: '',
  keywords: '',
  // inventoryOrderTypeUID: '',
  // assignedToUID: '',
};


export const EmptyInventoryOrder: InventoryOrder = {
  uid: '',
  orderType: Empty,
  orderNo: '',
  responsible: Empty,
  assignedTo: Empty,
  description: '',
  closingTime: '',
  postingTime: '',
  postedBy: Empty,
  status: Empty,
  items: [],
  actions: EmptyOrderActions,
};


export const EmptyInventoryPicking: InventoryPicking = {
  uid: '',
  orderType: Empty,
  orderNo: '',
  responsible: Empty,
  assignedTo: Empty,
  description: '',
  closingTime: '',
  postingTime: '',
  postedBy: Empty,
  status: Empty,
}


export function mapInventoryOrderItemFieldsFromSelection(
  item: InventoryProductSelection): InventoryOrderItemFields {
  const itemFields: InventoryOrderItemFields = {
    vendorProductUID: item.vendor.vendorProductUID ?? null,
    warehouseBinUID: item.warehouseBin.uid ?? null,
    quantity: item.quantity ?? null,
    description: item.notes ?? null,
  };

  return itemFields;
}
