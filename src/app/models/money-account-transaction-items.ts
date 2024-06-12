/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';


export interface MoneyAccountTransactionItem {
  uid: string;
  itemType: Identifiable;
  paymentType: Identifiable;
  reference: string;
  deposit: number;
  withdrawal: number;
  postedTime: DateString;
  notes: string;
  status: string;
}


export interface MoneyAccountTransactionItemFields {
  itemTypeUID: string;
  paymentTypeUID: string;
  reference: string;
  deposit: number;
  withdrawal: number;
  notes: string;
  postedTime: DateString;
}
