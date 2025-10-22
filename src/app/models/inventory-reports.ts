/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DataTableColumn } from './_data-table';

import { ReportData, ReportEntry, ReportQuery, ReportType } from './reporting';


export enum InventoryReportType {
  StocksByLocation = 'StocksByLocation',
  StocksByOrder    = 'StocksByOrder',
  StocksByProduct  = 'StocksByProduct',
}


export const InventoryReportTypesList: ReportType[] = [
  { uid: InventoryReportType.StocksByOrder,    name: 'Orden / Productos' },
  { uid: InventoryReportType.StocksByLocation, name: 'Localización / Productos' },
  { uid: InventoryReportType.StocksByProduct,  name: 'Producto / Localizaciones' },
];


export interface InventoryReportQuery extends ReportQuery {
  reportType: string;
  warehouses: string[];
  locations: string[];
  products: string[]
  orders: string[]
  keywords: string
}


export interface InventoryReport extends ReportData {
  query: InventoryReportQuery;
  columns: DataTableColumn[];
  entries: InventoryReportEntry[];
}


export interface InventoryReportEntry extends ReportEntry {

}


export const EmptyInventoryReportQuery: InventoryReportQuery = {
  reportType: null,
  warehouses: [],
  locations: [],
  products: [],
  orders: [],
  keywords: '',
};


export const EmptyInventoryReport: InventoryReport = {
  query: EmptyInventoryReportQuery,
  columns: [],
  entries: [],
};
