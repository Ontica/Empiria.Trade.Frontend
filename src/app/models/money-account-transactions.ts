/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { MoneyAccountTransactionItem } from './money-account-transaction-items';


export interface MoneyAccountTransactionDescriptor {
  uid: string;
  transactionTypeName: string;
  transactionNumber: string;
  transactionDate: DateString;
  transactionAmount: number;
}


export interface MoneyAccountTransaction {
  uid: string;
  transactionType: Identifiable;
  transactionNumber: string;
  transactionDate: DateString;
  transactionAmount: number;
  reference: string;
  notes: string;
  dueDate: DateString;
  items: MoneyAccountTransactionItem[];
}


export interface MoneyAccountTransactionFields {
  transactionTypeUID: string;
  transactionTime: DateString;
  transactionAmount: number;
  reference: string;
  notes: string;
}
