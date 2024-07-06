/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, EmptyMediaBase, Identifiable, MediaBase, isEmpty } from '@app/core';

import { PackagingTotals } from './packing';

import { Customer, EmptyCustomer } from './customer';


export enum ShippingStatus {
  EnCaptura = 'EnCaptura',
  EnProceso = 'EnProceso',
  Cerrado   = 'Cerrado',
  Rechazado = 'Rechazado',
}


export const ShippingStatusList: Identifiable[] = [
  { uid: ShippingStatus.EnCaptura, name: 'En captura' },
  { uid: ShippingStatus.EnProceso, name: 'En proceso' },
  { uid: ShippingStatus.Cerrado,   name: 'Cerrado' },
];


export const ShippingStatusForDeliveryList: Identifiable[] = [
  { uid: ShippingStatus.EnProceso, name: 'En proceso' },
  { uid: ShippingStatus.Cerrado, name: 'Cerrado' },
];


export function getShippingStatusName(statusUID: ShippingStatus): string {
  const status = ShippingStatusList.find(x => x.uid === statusUID);
  return isEmpty(status) ? statusUID : status.name;
}


export enum ShippingMethodTypes {
  RutaLocal   = 'RutaLocal',
  RutaForanea = 'RutaForanea',
  Ocurre      = 'Ocurre',
  Paqueteria  = 'Paqueteria',
}


export const ShippingMethodList: Identifiable[] = [
  { uid: ShippingMethodTypes.RutaLocal,   name: 'Ruta local' },
  { uid: ShippingMethodTypes.RutaForanea, name: 'Ruta foránea' },
  { uid: ShippingMethodTypes.Ocurre,      name: 'Ocurre' },
  { uid: ShippingMethodTypes.Paqueteria,  name: 'Paquetería' },
];


export const ReceptionMethodList: Identifiable[] = [
  { uid: ShippingMethodTypes.Ocurre,     name: 'Ocurre' },
  { uid: ShippingMethodTypes.Paqueteria, name: 'Paquetería' },
];


export const DefaultShippingMethod: Identifiable = {
  uid: ShippingMethodTypes.Paqueteria,
  name: 'Paquetería',
};


export enum OrderShippingStatusTypes {
  Asignado  = 'Asignado',
  Pendiente = 'Pendiente',
}


export const OrderShippingStatusList: Identifiable[] = [
  { uid: OrderShippingStatusTypes.Asignado,  name: OrderShippingStatusTypes.Asignado },
  { uid: OrderShippingStatusTypes.Pendiente, name: OrderShippingStatusTypes.Pendiente },
];


export interface ShippingQuery {
  queryType: ShippingQueryType;
  shippingMethodUID: ShippingMethodTypes;
  parcelSupplierUID: string;
  status: string;
  keywords: string;
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

  shippingMethod: Identifiable;
  shippingID: string;
  customer: Customer; // Customer[];
  shippingDate: DateString;
  status: ShippingStatus;

  parcelSupplier: Identifiable;
  shippingGuide: string;
  parcelAmount: number;
  customerAmount: number;

  totalPackages: number;
  totalWeight: number;
  totalVolume: number;

  ordersCount: number;
  ordersTotal: number;

  shippingLabelsMedia: MediaBase;
  billingsMedia: MediaBase;
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

  billingMedia: MediaBase;
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

  shippingMethod: Empty,
  shippingID: '',
  shippingDate: '',
  customer: EmptyCustomer,
  status: ShippingStatus.EnCaptura,

  parcelSupplier: Empty,
  shippingGuide: '',
  parcelAmount: null,
  customerAmount: null,

  ordersCount: 0,
  ordersTotal: 0,

  totalPackages: 0,
  totalWeight: 0,
  totalVolume: 0,

  shippingLabelsMedia: EmptyMediaBase,
  billingsMedia: EmptyMediaBase,
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
