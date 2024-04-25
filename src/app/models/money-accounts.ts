/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './_data-table';


export interface MoneyAccountQuery extends DataTableQuery {
  moneyAccountTypeUID: string;
  status: string;
  keywords: string;
}



export interface MoneyAccountDescriptor extends DataTableEntry {
  uid: string;
}


export interface MoneyAccountDataTable extends DataTable {
  query: MoneyAccountQuery;
  columns: DataTableColumn[];
  entries: MoneyAccountDescriptor[];
}


export const EmptyMoneyAccountQuery: MoneyAccountQuery = {
  moneyAccountTypeUID: '',
  status: '',
  keywords: '',
};


export const EmptyMoneyAccountDataTable: MoneyAccountDataTable = {
  query: EmptyMoneyAccountQuery,
  columns: [],
  entries: [],
};
