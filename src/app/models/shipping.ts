/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { OrderDescriptor, ShippingMethodTypes } from './order';


export interface ShippingQuery {
  keywords: string;
}


export interface ShippingFieldsQuery {
  orders: string[];
}


export interface Shipping {
  canEdit: boolean;
  shippingData: ShippingData;
  ordersForShipping: OrderForShipping[];
  shippingPalletsWithPackages?: ShippingPalletWithPackages[];
}


export interface ShippingData extends ShippingTotals {
  shippingUID: string;

  shippingDate: DateString;
  parcelSupplier: Identifiable;
  shippingGuide: string;
  parcelAmount: number;
  customerAmount: number;
  status: boolean;

  totalPackages: number;
  totalWeight: number;
  totalVolume: number;

  ordersCount: number;
  ordersTotal: number;
}


export interface ShippingTotals {
  ordersCount?: number;
  ordersTotal?: number;

  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
}


export interface OrderForShipping extends ShippingTotals {
  orderUID: string;
  orderNumber: string;
  orderTotal: number;
  customer: Identifiable;
  vendor: Identifiable;

  packages: OrderPackage[];

  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
}


export function mapOrdersDescriptorToOrdersForShipping(ordersDesc: OrderDescriptor[]): OrderForShipping[] {
  return ordersDesc.map<OrderForShipping>(x => mapToOrderForShipping(x));
}


function mapToOrderForShipping(orderDesc: OrderDescriptor): OrderForShipping {
  return {
    orderUID: orderDesc.uid,
    orderNumber: orderDesc.orderNumber,
    orderTotal: orderDesc.orderTotal,
    totalPackages: orderDesc.totalPackages,
    totalWeight: orderDesc.weight,
    customer: Empty, vendor: Empty, packages: [], totalVolume: null,
  }
}


export interface OrderPackage {
  packingItemUID: string;
  packageID: string;
  packageTypeName: string;

  totalWeight: number;
  totalVolume: number;
}


export interface ShippingPalletWithPackages extends ShippingTotals {
  shippingPalletUID: string;
  shippingPalletName: string;

  packages: string[];

  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
}


export const EmptyShippingTotals: ShippingTotals = {
  totalPackages: 0,
  totalWeight: 0,
  totalVolume: 0,
}


export const EmptyShippingPalletWithPackages: ShippingPalletWithPackages = {
  shippingPalletUID: '',
  shippingPalletName: '',

  packages: [],

  totalPackages: 0,
  totalWeight: 0,
  totalVolume: 0,
}


export const EmptyShippingData: ShippingData = {
  shippingUID: '',

  parcelSupplier: Empty,
  shippingGuide: '',
  parcelAmount: null,
  customerAmount: null,
  shippingDate: '',
  status: false,

  ordersCount: 0,
  ordersTotal: 0,

  totalPackages: 0,
  totalWeight: 0,
  totalVolume: 0,
};


export const EmptyShipping: Shipping = {
  canEdit: false,
  shippingData: EmptyShippingData,
  ordersForShipping: [],
  shippingPalletsWithPackages: [],
}


export interface ShippingFields {
  orders: string[];
  shippingData: ShippingDataFields;
}


export interface ShippingDataFields {
  shippingUID: string;
  parcelSupplierUID: string;
  shippingGuide: string;
  parcelAmount: number;
  customerAmount: number;
}
