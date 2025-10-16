/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTableEntry } from './_data-table';

import { EmptyOrderActions, Order, OrderActions, OrderHolder, OrderItem, OrderItemEntry,
         OrdersQuery } from './orders';

import { EntityStatus } from './_explorer-data';


export interface InventoryOrdersQuery extends OrdersQuery {
  status: string;
  keywords: string;
  inventoryTypeUID: string;
  warehouseUID: string;
}


export interface InventoryOrderDescriptor extends DataTableEntry {
  uid: string;
  orderTypeName: string;
  orderNo: string;
  inventoryTypeName: string;
  warehouseName: string;
  responsibleName: string;
  requestedByName: string;
  description: string;
  postingTime: DateString;
  status: string;
}


export interface InventoryType {
  uid: string;
  name: string;
  rules: InventoryTypeRules;
}


export interface InventoryTypeRules {
  entriesRequired: boolean;
  itemsRequired: boolean;
}


export interface InventoryOrder extends Order {
  uid: string;
  orderType: Identifiable;
  orderNo: string;
  inventoryType: InventoryType;
  warehouse: Identifiable;
  responsible: Identifiable;
  requestedBy: Identifiable;
  description: string;
  closingTime: DateString;
  postingTime: DateString;
  postedBy: Identifiable;
  status: Identifiable<EntityStatus>;
}


export interface InventoryOrderHolder extends OrderHolder {
  order: InventoryOrder;
  items: InventoryOrderItem[];
  actions: OrderActions;
}


export interface InventoryOrderFields {
  inventoryTypeUID: string;
  warehouseUID: string;
  responsibleUID: string;
  requestedByUID: string;
  description: string;
}


export interface InventoryPicking extends Order {
  uid: string;
  orderType: Identifiable;
  orderNo: string;
  inventoryType: InventoryType;
  warehouse: Identifiable;
  responsible: Identifiable;
  requestedBy: Identifiable;
  description: string;
}


export interface InventoryOrderItem extends OrderItem {
  uid: string;
  productName: string;
  location: string;
  quantity: number;
  assignedQuantity: number;
  entries: InventoryOrderItemEntry[];
}


export interface InventoryOrderItemEntry extends OrderItemEntry {
  uid: string;
  product: string;
  location: string;
  quantity: number;
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


export interface ProductLocationFields {
  product: string;
  location: string;
  quantity: number;
}


export interface InventoryOrderItemQuantityFields {
  quantity: number;
}


export interface InventoryOrderItemFields extends ProductLocationFields {

}


export interface InventoryOrderItemEntryFields extends ProductLocationFields {

}



export const EmptyInventoryOrdersQuery: InventoryOrdersQuery = {
  queryType: '',
  inventoryTypeUID: '',
  warehouseUID: '',
  status: '',
  keywords: '',
};


export const EmptyInventoryType: InventoryType = {
  uid: '',
  name: '',
  rules: {
    itemsRequired: false,
    entriesRequired: false,
  }
};


export const EmptyInventoryOrder: InventoryOrder = {
  uid: '',
  orderType: Empty,
  orderNo: '',
  inventoryType: EmptyInventoryType,
  warehouse: Empty,
  responsible: Empty,
  requestedBy: Empty,
  description: '',
  closingTime: '',
  postingTime: '',
  postedBy: Empty,
  status: Empty,
};


export const EmptyInventoryOrderHolder: InventoryOrderHolder = {
  order: EmptyInventoryOrder,
  items: [],
  actions: EmptyOrderActions,
};


export const EmptyInventoryOrderItem: InventoryOrderItem = {
  uid: '',
  productName: '',
  location: '',
  quantity: null,
  assignedQuantity: null,
  entries: [],
}


export const EmptyInventoryPicking: InventoryPicking = {
  uid: '',
  orderType: Empty,
  orderNo: '',
  responsible: Empty,
  inventoryType: EmptyInventoryType,
  warehouse: Empty,
  requestedBy: Empty,
  description: '',
  closingTime: '',
  postingTime: '',
  postedBy: Empty,
  status: Empty,
}
