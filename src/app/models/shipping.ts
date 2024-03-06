/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { PackagingTotals } from './packing';


export enum ShippingStatus {
  Abierto = 'Abierto',
  Cerrado = 'Cerrado',
}


export const ShippingStatusList: string[] = [
  ShippingStatus.Abierto,
  ShippingStatus.Cerrado,
];


export interface ShippingQuery {
  keywords: string;
  parcelSupplierUID: string;
  status: string;
}


export enum ShippingQueryType {
  Shipping = 'shipping',
  Delivery = 'delivery'
}


export interface ShippingFieldsQuery {
  orders: string[];
}


export interface Shipping {
  shippingData: ShippingData;
  ordersForShipping: OrderForShipping[];
  shippingPalletsWithPackages?: ShippingPalletWithPackages[];
  actions: ShippingActions;
}


export interface ShippingActions {
  canEdit: boolean;
  canDelete: boolean;
  canCloseEdit: boolean;
  canPrintShippingLabel: boolean;
  canPrintOrder: boolean;
  canCloseShipping: boolean;
}


export interface ShippingData extends PackagingTotals {
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


export interface OrderForShipping extends PackagingTotals {
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


export interface OrderPackage {
  packingItemUID: string;
  packageID: string;
  packageTypeName: string;

  totalWeight: number;
  totalVolume: number;
}


export interface ShippingPalletWithPackages extends PackagingTotals {
  shippingPalletUID: string;
  shippingPalletName: string;

  packages: string[];

  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
}


export interface ShippingPalletFields {
  shippingPalletName: string;
  packages: string[];
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


export const EmptyShippingActions: ShippingActions = {
  canEdit: false,
  canDelete: false,
  canCloseEdit: false,
  canPrintShippingLabel: false,
  canPrintOrder: false,
  canCloseShipping: false,
};


export const EmptyShipping: Shipping = {
  shippingData: EmptyShippingData,
  ordersForShipping: [],
  shippingPalletsWithPackages: [],
  actions: EmptyShippingActions,
};
