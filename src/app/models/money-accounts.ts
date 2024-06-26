/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType, DataTableEntry,
         DataTableQuery } from './_data-table';

import { MoneyAccountTransactionDescriptor } from './money-account-transactions';


export interface MoneyAccountQuery extends DataTableQuery {
  moneyAccountTypeUID: string;
  status: string;
  keywords: string;
}


export interface MoneyAccountDescriptor extends DataTableEntry {
  uid: string;
}


export interface MoneyAccountsDataTable extends DataTable {
  query: MoneyAccountQuery;
  columns: DataTableColumn[];
  entries: MoneyAccountDescriptor[];
}


export interface MoneyAccountTransactionsDataTable extends DataTable {
  columns: DataTableColumn[];
  entries: MoneyAccountTransactionDescriptor[];
}


export interface MoneyAccount {
  uid: string;
  moneyAccountType: Identifiable;
  moneyAccountNumber: string;
  moneyAccountOwner: Identifiable;
  moneyAccountLimit: number;
  limitDaysToPay: number;
  notes: string;
  balance: number;
  status: Identifiable;
  transactions: MoneyAccountTransactionDescriptor[];
  actions: MoneyAccountActions;
}


export interface MoneyAccountActions {
  canEdit: boolean;
  canDelete: boolean;
  canSuspend: boolean;
  canActivate: boolean;
  canSetPending: boolean;
  canEditTransactions: boolean;
}


export interface MoneyAccountFields {
  typeUID: string;
  ownerUID: string;
  moneyAccountLimit: number;
  limitDaysToPay: number;
  notes: string;
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


export const EmptyMoneyAccountActions: MoneyAccountActions = {
  canEdit: false,
  canDelete: false,
  canActivate: false,
  canSuspend: false,
  canSetPending: false,
  canEditTransactions: false,
};


export const EmptyMoneyAccount: MoneyAccount = {
  uid: '',
  moneyAccountNumber: '',
  moneyAccountType: Empty,
  moneyAccountOwner: Empty,
  moneyAccountLimit: 0,
  limitDaysToPay: 0,
  notes: '',
  balance: 0,
  status: Empty,
  transactions: [],
  actions: EmptyMoneyAccountActions,
};


export const MoneyAccountTransactionColumns: DataTableColumn[] = [
  {
    field: 'transactionTypeName',
    title: 'Tipo de transacción',
    type: DataTableColumnType.text,

  },
  {
    field: 'transactionNumber',
    title: 'Número de transacción',
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
    field: 'transactionAmount',
    title: 'Importe',
    type: DataTableColumnType.decimal,
  },
];


export const EmptyMoneyAccountTransactionsDataTable: MoneyAccountTransactionsDataTable = {
  columns: MoneyAccountTransactionColumns,
  entries: [],
};
