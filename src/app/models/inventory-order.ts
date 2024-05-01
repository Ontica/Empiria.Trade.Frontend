/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './_data-table';


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
  items: [];
}


export interface InventoryOrderFields {
  inventoryOrderTypeUID: string;
  responsibleUID: string;
  assignedToUID: string;
  notes: string;
}


export interface InventoryOrderItem {
  inventoryOrderUID: string;
  uid: string;
  notes: string;
  vendorProduct: Identifiable;
  warehouseBin: Identifiable;
  quantity: number;
  inputQuantity: number;
  outputQuantity: number;
  status: InventoryStatus;
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
