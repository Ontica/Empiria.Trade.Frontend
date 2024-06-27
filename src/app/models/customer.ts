/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable, isEmpty } from '@app/core';

import { Address, Contact, Party } from '@app/models';


export const PaymentConditionList: Identifiable[] = [
  { uid: 'Credito', name: 'Crédito' },
  { uid: 'Contado', name: 'Contado' },
];


export interface Customer extends Party {
  uid: string;
  name: string;
  contacts: Contact[];
  addresses: Address[];
}


export const EmptyCustomer: Customer = {
  uid: '',
  name: '',
  contacts: [],
  addresses: [],
};


export const EmptyContact: Contact = {
  uid: '',
  name: '',
  phone: '',
};


export const EmptyAddress: Address = {
  uid: '',
  name: '',
  description: '',
};


export interface CustomerSelection {
  customer: Customer;
  contact: Contact;
  address: Address;
}


export const EmptyCustomerSelection: CustomerSelection = {
  customer: null,
  contact: null,
  address: null,
};


export function buildCustomerSelection(customer: Customer,
                                       contact: Contact,
                                       address: Address): CustomerSelection {
  const data: CustomerSelection = {
    customer: isEmpty(customer) ? null : customer,
    contact: isEmpty(contact) ? null : contact,
    address: isEmpty(address) ? null : address,
  };

  return data;
}


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
