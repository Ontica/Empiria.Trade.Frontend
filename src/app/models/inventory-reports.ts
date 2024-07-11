/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DataTableColumn } from './_data-table';

import { ReportData, ReportEntry, ReportQuery, ReportType } from './reporting';


export enum InventoryReportType {
  StocksByProduct  = 'StocksByProduct',
  StocksByLocation = 'StocksByLocation',
}


export const InventoryReportTypesList: ReportType[] = [
  { uid: InventoryReportType.StocksByProduct,  name: 'Producto / Localizaciones' },
  { uid: InventoryReportType.StocksByLocation, name: 'Localización / Productos' },
];


export interface InventoryReportQuery extends ReportQuery {
  reportType: string;
  products?: string[]
  warehouseBins?: string[];
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
  products: [],
  warehouseBins: [],
  keywords: '',
};


export const EmptyInventoryReport: InventoryReport = {
  query: EmptyInventoryReportQuery,
  columns: [],
  entries: [],
};
