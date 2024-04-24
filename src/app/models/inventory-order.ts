/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType, DataTableEntry,
         DataTableQuery } from './_data-table';


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



export const InventoryOrderColumns: DataTableColumn[] = [
  {
    field: 'inventoryOrderTypeName',
    title: 'Tipo',
    type: DataTableColumnType.text,
  },
  {
    field: 'inventoryOrderNo',
    title: 'Número de orden',
    type: DataTableColumnType.text_link,
  },
  {
    field: 'responsibleName',
    title: 'Responsable',
    type: DataTableColumnType.text,
  },
  {
    field: 'assignedToName',
    title: 'Asignado a',
    type: DataTableColumnType.text,
  },
  {
    field: 'postingTime',
    title: 'Fecha',
    type: DataTableColumnType.date,
  },
  {
    field: 'inventoryStatus',
    title: 'Estatus',
    type: DataTableColumnType.text_tag,
  },
];


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
  columns: InventoryOrderColumns,
  entries: [],
};


export function mapToInventoryOrderDataTable(query: InventoryOrderQuery,
                                             entries: InventoryOrderDescriptor[]): InventoryOrderDataTable {
  return {
    query,
    columns: InventoryOrderColumns,
    entries,
  };
}
