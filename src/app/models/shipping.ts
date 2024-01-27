/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';


export interface ShippingQuery {
  orders: string[];
}


export interface Shipping {
  shippingData: ShippingData;
  ordersForShipping: OrderForShipping[];

  // optionals
  shippingPallets?: ShippingPallet[];
  missingShippingPallets?: MissingShippingPallets[];
}


export interface ShippingData {
  shippingUID: string;

  shippingDate: DateString;
  parcelSupplier: Identifiable;
  shippingGuide: string;
  parcelAmount: number;
  customerAmount: number;

  ordersCount: number;
  ordersTotal: number;

  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
}


export interface OrderForShipping {
  orderUID: string;
  orderName: string;
  orderTotal: number;
  customer: Identifiable;
  vendor: Identifiable;
  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
}


export interface MissingShippingPallets {

}


export interface ShippingPallet {
  palledID: string;
}


export const EmptyShippingData: ShippingData = {
  shippingUID: '',

  parcelSupplier: Empty,
  shippingGuide: '',
  parcelAmount: null,
  customerAmount: null,
  shippingDate: '',

  ordersCount: 0,
  ordersTotal: 0,

  totalPackages: 0,
  totalWeight: 0,
  totalVolume: 0,
};


export const EmptyShipping: Shipping = {
  shippingData: EmptyShippingData,
  ordersForShipping: [],
  shippingPallets: [],
  missingShippingPallets: [],
}


export interface ShippingDataFields {
  parcelSupplierUID: string;
  shippingGuide: string;
  parcelAmount: number;
  customerAmount: number;
}
