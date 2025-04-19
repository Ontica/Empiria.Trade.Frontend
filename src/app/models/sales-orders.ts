/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty } from '@app/core';

import { clone } from '@app/shared/utils';

import { DataTableEntry } from './_data-table';

import { Address, Contact, Party } from './contacts';

import { Customer, CustomerCredit, EmptyAddress, EmptyContact, EmptyCustomer,
         EmptyCustomerCredit } from './customer';

import { OrdersQuery, OrdersOperation, OrdersQueryType } from './orders';

import { EmptyPacking, Packing } from './packing';

import { Presentation, Product, ProductSelection, Vendor } from './product';

import { EmptyShippingData, ShippingData } from './shipping';


export enum SalesOrdersOperationType {
  parcel_delivery        = 'parcel-delivery',
  customer_delivery      = 'customer-delivery',
  local_route_delivery   = 'local-route-delivery',
  local_foreign_delivery = 'local-foreign-delivery',
  cancel                 = 'cancel',
  print                  = 'print',
}


export const SalesOrdersOperationsList: OrdersOperation[] = [
  { uid: SalesOrdersOperationType.parcel_delivery,        name: 'Enviar por paquetería' },
  { uid: SalesOrdersOperationType.customer_delivery,      name: 'Entrega por ocurre' },
  { uid: SalesOrdersOperationType.local_route_delivery,   name: 'Enviar por ruta local' },
  { uid: SalesOrdersOperationType.local_foreign_delivery, name: 'Enviar por ruta foránea' },
  { uid: SalesOrdersOperationType.print,                  name: 'Imprimir' },
  { uid: SalesOrdersOperationType.cancel,                 name: 'Cancelar' },
];


export interface SalesOrdersQuery extends OrdersQuery {
  queryType: string;
  keywords: string;
  fromDate: DateString;
  toDate: DateString;
  status: string;
  shippingMethod: string;
  customerUID: string;
  shippingStatus: string;
}


export const EmptySalesOrdersQuery: SalesOrdersQuery = {
  queryType: OrdersQueryType.Sales,
  keywords: null,
  fromDate: null,
  toDate: null,
  status: null,
  shippingMethod: null,
  customerUID: null,
  shippingStatus: null,
};


export interface SaleOrderDescriptor extends DataTableEntry {
  uid: string;
  orderNumber: string;
  customerName: string;
  supplierName: string;
  salesAgentName: string;
  status: string;
  statusName: string;
  orderTime: DateString;
  orderTotal: number;
  totalDebt: number;
  totalPackages: number;
  weight: number;
  shippingStatus: string;
}


export interface SaleOrderFields {
  uid?: string;
  orderNumber: string;
  orderTime: DateString;
  status: string;
  customerUID: string;
  customerContactUID: string;
  customerAddressUID: string;
  salesAgentUID: string;
  supplierUID: string;
  paymentCondition: string;
  shippingMethod: string;
  priceList: string;
  notes: string;
  items: SaleOrderItemFields[];
}


export interface SaleOrderItemFields {
  orderItemUID: string;
  vendorProductUID: string;
  quantity: number;
  unitPrice: number;
  salesPrice: number;
  discountPolicy: string;
  discount1: number;
  discount2: number;
  subtotal: number;
}


export interface SaleOrderGeneralData extends SaleOrderAdditionalData {
  uid?: string;
  orderNumber: string;
  orderTime: DateString;
  status: string;
  statusName: string;
  priceList: string;
  customer: Customer;
  customerContact: Contact;
  customerAddress: Address;
  supplier: Party;
  salesAgent: Party;
  paymentCondition: string;
  shippingMethod: string;
  notes?: string;
}


export interface SaleOrderAdditionalData {
  notes?: string;
}


export interface SaleOrderTotals {
  itemsCount: number;
  itemsTotal: number;
  shipment: number;
  discount: number;
  taxes: number;
  orderTotal: number;
}


export interface SaleOrderData extends SaleOrderGeneralData, SaleOrderAdditionalData, SaleOrderTotals {

}


export interface SaleAuthorization {
  authorizationStatus: string;
  authorizationTime: DateString;
}


export interface SaleOrder {
  orderData: SaleOrderData;
  items: SaleOrderItem[];
  authorization: SaleAuthorization;
  customerCredit: CustomerCredit;
  shipping: ShippingData;
  packing: Packing;
  actions: SaleOrderActions;
}


export interface SaleOrderActions {
  can: {
    update: boolean;
    cancel: boolean;
    apply: boolean;
    authorize: boolean;
    deauthorize: boolean;
    editPicking: boolean; // agregar este campo nuevo
    editPacking: boolean;
    closePacking: boolean;
    editShipping: boolean;
    sendShipping: boolean;
  };
  show: {
    orderData: boolean;
    creditData: boolean;
    pickingData: boolean; // agregar este campo nuevo
    packingData: boolean;
    shippingData: boolean;
  };
}


export interface SaleOrderItem extends SaleOrderItemData {
  orderItemUID: string;
  product: Product;
  presentation: Presentation;
  vendor: Vendor;
  quantity: number;

  unitPrice: number;
  salesPrice: number;
  discountPolicy: string;
  discount1: number;
  discount2: number;
  subtotal: number;
}


export interface SaleOrderItemData {
  orderItemUID: string;
  product: Product;
  presentation: Presentation;
  vendor: Vendor;
  quantity: number;
}


export const EmptySaleOrderGeneralData: SaleOrderGeneralData = {
  uid: null,
  orderNumber: '',
  orderTime: '',
  shippingMethod: '',
  status: '',
  statusName: '',
  customer: EmptyCustomer,
  customerContact: EmptyContact,
  customerAddress: EmptyAddress,
  supplier: Empty,
  salesAgent: Empty,
  paymentCondition: '',
  priceList: '',
  notes: '',
};


export const EmptySaleOrderAdditionalData: SaleOrderAdditionalData = {
  notes: '',
};


export const EmptySaleOrderTotals: SaleOrderTotals = {
  itemsCount: 0,
  itemsTotal: 0,
  shipment: 0,
  discount: 0,
  taxes: 0,
  orderTotal: 0,
};


export const EmptySaleOrderData: SaleOrderData = {
  uid: null,
  orderNumber: '',
  orderTime: '',
  notes: '',
  shippingMethod: '',
  status: '',
  statusName: '',
  customer: EmptyCustomer,
  customerContact: EmptyContact,
  customerAddress: EmptyAddress,
  supplier: Empty,
  salesAgent: Empty,
  paymentCondition: '',
  priceList: '',
  itemsCount: 0,
  itemsTotal: 0,
  shipment: 0,
  discount: 0,
  taxes: 0,
  orderTotal: 0,
};


export const EmptySaleAuthorization: SaleAuthorization = {
  authorizationStatus: '',
  authorizationTime: '',
};


export const EmptySaleOrderActions: SaleOrderActions = {
  can: {
    update: false,
    cancel: false,
    apply: false,
    authorize: false,
    deauthorize: false,
    editPicking: false,
    editPacking: false,
    closePacking: false,
    editShipping: false,
    sendShipping: false,
  },
  show: {
    orderData: false,
    creditData: false,
    pickingData: false,
    packingData: false,
    shippingData: false,
  },
};


export function mapSaleOrderDescriptorFromSaleOrder(order: SaleOrder): SaleOrderDescriptor {
  return {
    uid: order.orderData.uid,
    orderNumber: order.orderData.orderNumber,
    customerName: order.orderData.customer.name,
    supplierName: order.orderData.supplier.name,
    salesAgentName: order.orderData.salesAgent.name,
    status: order.orderData.status,
    statusName: order.orderData.statusName,
    totalDebt: order.customerCredit.totalDebt,
    orderTime: order.orderData.orderTime,
    orderTotal: order.orderData.orderTotal,
    totalPackages: order.packing.data.totalPackages,
    weight: order.packing.data.totalWeight,
    shippingStatus: 'Pendiente',
  };
}


export function mapSaleOrderFieldsFromSaleOrder(order: SaleOrder): SaleOrderFields {
  const orderFields: SaleOrderFields = {
    uid: order.orderData.uid,
    orderNumber: order.orderData.orderNumber,
    orderTime: order.orderData.orderTime,
    status: order.orderData.status,
    customerUID: order.orderData.customer?.uid ?? '',
    customerContactUID: order.orderData.customerContact?.uid ?? '',
    customerAddressUID: order.orderData.customerAddress?.uid ?? '',
    salesAgentUID: order.orderData.salesAgent?.uid ?? '',
    supplierUID: order.orderData.supplier?.uid ?? '',
    paymentCondition: order.orderData.paymentCondition,
    shippingMethod: order.orderData.shippingMethod,
    priceList: order.orderData.priceList,
    items: order.items.map(x => mapSaleOrderItemFieldsFromSaleOrderItem(x)),
    notes: order.orderData.notes,
  };

  return orderFields;
}


export function mapSaleOrderItemFieldsFromSaleOrderItem(orderItem: SaleOrderItem): SaleOrderItemFields {
  const orderFields: SaleOrderItemFields = {
    orderItemUID: orderItem.orderItemUID,
    vendorProductUID: orderItem.vendor.vendorProductUID ?? null,
    quantity: orderItem.quantity ?? null,
    unitPrice: orderItem.unitPrice ?? null,
    salesPrice: orderItem.salesPrice ?? null,
    discountPolicy: orderItem.discountPolicy ?? null,
    discount1: orderItem.discount1 ?? null,
    discount2: orderItem.discount2 ?? null,
    subtotal: orderItem.subtotal ?? null,
  };

  return orderFields;
}


export function EmptySaleOrder(): SaleOrder {

  return clone<SaleOrder>({
    orderData: EmptySaleOrderData,
    items: [],
    authorization: EmptySaleAuthorization,
    customerCredit: EmptyCustomerCredit,
    shipping: EmptyShippingData,
    packing: EmptyPacking,
    actions: EmptySaleOrderActions,
  });

}


export function mapSaleOrderItemFromProductSelection(product: ProductSelection): SaleOrderItem {
  const productForSeeker: SaleOrderItem = {
    orderItemUID: null,
    product: product.product,
    presentation: product.presentation,
    vendor: product.vendor,
    quantity: product.quantity ?? null,
    unitPrice: product.vendor.price ?? null,
    salesPrice: null,
    discountPolicy: null,
    discount1: null,
    discount2: null,
    subtotal: null,
  };

  return productForSeeker;
}
