/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export interface Party {
  uid: string;
  name: string;
}


export interface Contact {
  uid: string;
  name: string;
  phone: string;
}


export interface Customer extends Party {
  uid: string;
  name: string;
  contacts: Contact[];
}


export const EmptyCustomer: Customer = {
  uid: '',
  name: '',
  contacts: [],
};


export const EmptyContact: Contact = {
  uid: '',
  name: '',
  phone: '',
};
