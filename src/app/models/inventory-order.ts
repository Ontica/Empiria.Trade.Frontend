/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './_data-table';

import { InventoryProductSelection } from './product';


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


export interface InventoryOrderQuery extends DataTableQuery {
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


export interface InventoryOrderDataTable extends DataTable {
  query: InventoryOrderQuery;
  columns: DataTableColumn[];
  entries: InventoryOrderDescriptor[];
}


export interface InventoryOrder {
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
  position: string;
  level: string;
}


export interface InventoryOrderItemFields {
  notes: string;
  vendorProductUID: string;
  warehouseBinUID: string;
  quantity: number;
  position: number;
  level: number;
}


export const EmptyInventoryOrderQuery: InventoryOrderQuery = {
  inventoryOrderTypeUID: '',
  assignedToUID: '',
  status: '',
  keywords: '',
};


export const EmptyInventoryOrderDataTable: InventoryOrderDataTable = {
  query: EmptyInventoryOrderQuery,
  columns: [],
  entries: [],
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
};


export function mapInventoryOrderItemFieldsFromSelection(
  item: InventoryProductSelection): InventoryOrderItemFields {
  const itemFields: InventoryOrderItemFields = {
    vendorProductUID: item.vendor.vendorProductUID ?? null,
    warehouseBinUID: item.warehouseBin.uid ?? null,
    position: item.position ?? null,
    level: item.level ?? null,
    quantity: item.quantity ?? null,
    notes: item.notes ?? null,
  };

  return itemFields;
}
