/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

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
