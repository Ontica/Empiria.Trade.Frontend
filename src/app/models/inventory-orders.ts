/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTableEntry } from './_data-table';

import { InventoryProductSelection } from './product';

import { OrdersQuery } from './orders';



export enum InventoryStatus {
  Abierto   = 'Abierto',
  EnProceso = 'EnProceso',
  Cerrado   = 'Cerrado',
}


export const InventoryStatusList: Identifiable[] = [
  { uid: InventoryStatus.Abierto,   name: 'Abierto' },
  { uid: InventoryStatus.EnProceso, name: 'En proceso' },
  { uid: InventoryStatus.Cerrado,   name: 'Cerrado' },
];


export interface InventoryOrdersQuery extends OrdersQuery {
  inventoryOrderTypeUID: string;
  assignedToUID: string;
  status: string;
  keywords: string;
}


export interface InventoryOrderDescriptor extends DataTableEntry {
  uid: string;
  inventoryOrderTypeName: string;
  inventoryOrderNo: string;
  responsibleName: string;
  assignedToName: string;
  postingTime: DateString;
  notes: string;
  inventoryStatus: InventoryStatus;
}


export interface InventoryOrder extends InventoryPicking {
  uid: string;
  inventoryOrderType: Identifiable;
  inventoryOrderNo: string;
  responsible: Identifiable;
  assignedTo: Identifiable;
  notes: string;
  closingTime: DateString;
  postingTime: DateString;
  postedBy: Identifiable;
  status: InventoryStatus;
  items: InventoryOrderItem[];
  actions: InventoryOrderActions;
}


export interface InventoryPicking {
  inventoryOrderType: Identifiable;
  inventoryOrderNo: string;
  responsible: Identifiable;
  assignedTo: Identifiable;
  notes: string;
}


export interface InventoryOrderActions {
  canEdit: boolean;
  canEditItems: boolean;
  canDelete: boolean;
  canClose: boolean;
  canOpen: boolean;
}


export interface InventoryOrderFields {
  inventoryOrderTypeUID: string;
  responsibleUID: string;
  assignedToUID: string;
  notes: string;
}


export interface InventoryOrderItem {
  uid: string;
  product: InventoryProduct;
  warehouseBin: InventoryWarehouseBin;
  quantity: number;
  notes: string;
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
  notes: string;
}


export const EmptyInventoryOrdersQuery: InventoryOrdersQuery = {
  queryType: '',
  inventoryOrderTypeUID: '',
  assignedToUID: '',
  status: '',
  keywords: '',
};


export const EmptyInventoryOrderActions: InventoryOrderActions = {
  canEdit: false,
  canEditItems: false,
  canDelete: false,
  canClose: false,
  canOpen: false,
};


export const EmptyInventoryOrder: InventoryOrder = {
  uid: '',
  inventoryOrderType: Empty,
  inventoryOrderNo: '',
  responsible: Empty,
  assignedTo: Empty,
  notes: '',
  closingTime: '',
  postingTime: '',
  postedBy: Empty,
  status: null,
  items: [],
  actions: EmptyInventoryOrderActions,
};


export const EmptyInventoryPicking: InventoryPicking = {
  inventoryOrderType: Empty,
  inventoryOrderNo: '',
  responsible: Empty,
  assignedTo: Empty,
  notes: '',
}


export function mapInventoryOrderItemFieldsFromSelection(
  item: InventoryProductSelection): InventoryOrderItemFields {
  const itemFields: InventoryOrderItemFields = {
    vendorProductUID: item.vendor.vendorProductUID ?? null,
    warehouseBinUID: item.warehouseBin.uid ?? null,
    quantity: item.quantity ?? null,
    notes: item.notes ?? null,
  };

  return itemFields;
}
