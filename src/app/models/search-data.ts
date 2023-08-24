/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from "@app/core";

import { DataTable, DataTableColumn, DataTableColumnType, DataTableEntry, DefaultExportationType,
         ExportationType, FileType } from "@app/models";


export interface SearchDataTable extends DataTable {
  entries: SearchEntry[];
}


export interface SearchEntry extends DataTableEntry {
  number: string;
  name: string;
  type: string;
  organization: string;
  description: string;
}


export const ExportationTypeList: ExportationType[] = [
  DefaultExportationType,
  { uid: FileType.PDF, name: FileType.PDF, fileType: FileType.PDF },
  { uid: FileType.Xml, name: FileType.Xml, fileType: FileType.Xml },
];


const DEFAULT_COLUMNS: DataTableColumn[] = [
  { field: 'number', title: 'Número', type: DataTableColumnType.text_link },
  { field: 'name', title: 'Nombre', type: DataTableColumnType.text_nowrap },
  { field: 'type', title: 'Tipo', type: DataTableColumnType.text },
  { field: 'organization', title: 'Organizacón', type: DataTableColumnType.text },
  { field: 'description', title: 'Descripción', type: DataTableColumnType.text },
];


const DUMMY_ENTRIES: SearchEntry[] = [
  { number: '0001', name: 'Artifacts', type: 'Interno', organization: 'La via Ontica', description: 'Proyecto de control de proyectos.' },
  { number: '0002', name: 'One Point', type: 'Interno', organization: 'La via Ontica', description: '' },
  { number: '0003', name: 'Financial Accounting', type: 'Gobierno', organization: 'Banobras', description: '' },
  { number: '0004', name: 'Land', type: 'Gobierno', organization: 'Gobierno del estado de Zacatecas', description: 'Proyecto de registro publico de la propiedad para el gobierno del estado de Zacatecas' },
  { number: '0005', name: 'Talanza', type: 'Privada', organization: 'Talanza', description: '' },
  { number: '0006', name: 'Compliance', type: 'Privada', organization: 'Talanza', description: '' },
];


export const EMPTY_SEARCH_DATA: SearchDataTable = {
  query: {},
  columns: DEFAULT_COLUMNS,
  entries: [],
};


export const SEARCH_DATA: SearchDataTable = {
  query: {},
  columns: DEFAULT_COLUMNS,
  entries: [...[], ...DUMMY_ENTRIES]
            // ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES,
            // ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES,
            // ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES, ...DUMMY_ENTRIES,],
};


export const COUNTRY_DATA: Identifiable[] = [
  { uid:'MEX', name: 'México' },
  { uid: 'EUA', name: 'Estados Unidos' },
  { uid: 'CAN', name: 'Canadá' },
];


export const TYPE_DATA: Identifiable[] = [
  { uid: 'Interno', name: 'Interno' },
  { uid: 'Externo', name: 'Externo' },
  { uid: 'Gobierno', name: 'Gobierno' },
  { uid: 'Privada', name: 'Privada' },
];


export const STATUS_DATA: Identifiable[] = [
  { uid: 'A', name: 'Activo' },
  { uid: 'I', name: 'Inactivo' },
  { uid: 'X', name: 'Suspendido' },
];


export const EDITORS_DATA: Identifiable[] = [
  { uid: 'ONTICAJC', name: 'José Manuel Cota' },
  { uid: 'ONTICACY', name: 'Christian Yañez' },
  { uid: 'ONTICAJM', name: 'Janeth Montero' },
  { uid: 'ONTICAER', name: 'Efraín Rodríguez' },
];
