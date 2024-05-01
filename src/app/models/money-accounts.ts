/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType, DataTableEntry, DataTableQuery } from './_data-table';


export interface MoneyAccountQuery extends DataTableQuery {
  moneyAccountTypeUID: string;
  status: string;
  keywords: string;
}


export interface MoneyAccountDescriptor extends DataTableEntry {
  uid: string;
}


export interface MoneyAccount {
  uid: string;
  moneyAccountType: Identifiable;
  moneyAccountNumber: string;
  moneyAccountOwner: Identifiable;
  moneyAccountLimit: number;
  balance: number;
  status: Identifiable;
  transactions: MoneyAccountTransaction[];
}


export interface MoneyAccountFields {
  moneyAccountTypeUID: string;
  moneyAccountNumber: string;
  moneyAccountOwnerUID: string;
  moneyAccountLimit: number;
}


export interface MoneyAccountTransaction {
  uid: string;
  operationNumber: string;
  operationType: string;
  transactionDate: DateString;
  creditAmount: number;
  debitAmount: number;
  dueDate: DateString;
}


export interface MoneyAccountsDataTable extends DataTable {
  query: MoneyAccountQuery;
  columns: DataTableColumn[];
  entries: MoneyAccountDescriptor[];
}


export interface MoneyAccountTransactionsDataTable extends DataTable {
  columns: DataTableColumn[];
  entries: MoneyAccountTransaction[];
}


export const EmptyMoneyAccountQuery: MoneyAccountQuery = {
  moneyAccountTypeUID: '',
  status: '',
  keywords: '',
};


export const EmptyMoneyAccountDataTable: MoneyAccountsDataTable = {
  query: EmptyMoneyAccountQuery,
  columns: [],
  entries: [],
};


export const EmptyMoneyAccount: MoneyAccount = {
  uid: '',
  moneyAccountNumber: '',
  moneyAccountType: Empty,
  moneyAccountOwner: Empty,
  moneyAccountLimit: 0,
  balance: 0,
  status: Empty,
  transactions: [],
};


export const MoneyAccountTransactionColumns: DataTableColumn[] = [
  {
    field: 'operationType',
    title: 'Tipo de operacion',
    type: DataTableColumnType.text,
  },
  {
    field: 'operationNumber',
    title: 'Número',
    type: DataTableColumnType.text_link,
  },
  {
    field: 'transactionDate',
    title: 'Fecha',
    type: DataTableColumnType.date,
  },
  {
    field: 'dueDate',
    title: 'Vencimiento',
    type: DataTableColumnType.date,
  },
  {
    field: 'creditAmount',
    title: 'Cargo',
    type: DataTableColumnType.decimal,
  },
  {
    field: 'debitAmount',
    title: 'Abono',
    type: DataTableColumnType.decimal,
  },
];


export const EmptyMoneyAccountTransactionsDataTable: MoneyAccountTransactionsDataTable = {
  columns: MoneyAccountTransactionColumns,
  entries: [],
};
