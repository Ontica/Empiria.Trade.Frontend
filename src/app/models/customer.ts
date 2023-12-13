/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';


export interface CustomerCredit {
  creditLimit: number;
  totalDebt: number;
  creditTransactions: CreditTransaction[];
}


export interface CreditTransaction {
  ticketNumber: string;
  transactionDate: DateString;
  creditAmount: number;
  debitAmount: number;
  dueDate: DateString;
  daysToPay: number;
}


export const EmptyCustomerCredit: CustomerCredit = {
  creditLimit: 0,
  totalDebt: 0,
  creditTransactions: [],
}
