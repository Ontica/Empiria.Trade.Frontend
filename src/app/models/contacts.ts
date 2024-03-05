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


export interface Address {
  uid: string;
  name: string;
  description: string;
}


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
