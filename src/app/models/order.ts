/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { clone } from '@app/shared/utils';

import { Contact, Customer, Party, EmptyCustomer, EmptyContact } from './contacts';

import { Presentation, Product, ProductSelection, Vendor } from './product';

import { CustomerCredit, EmptyCustomerCredit } from './customer';

import { EmptyPacking, Packing } from './packing';

import { EmptyShippingData, ShippingData } from './shipping';


export interface OrderTypeConfig {
  type: OrderQueryType;
  titleText: string;
  itemText: string;
  canAdd?: boolean;
}


export const DefaultOrderStatus: string = 'Captured';


export const ShippingMethodList: Identifiable[] = [
  { uid: 'RutaLocal', name: 'Ruta local' },
  { uid: 'RutaForanea', name: 'Ruta foránea' },
  { uid: 'Ocurre', name: 'Ocurre' },
  { uid: 'Paqueteria', name: 'Paquetería' },
];


export const PaymentConditionList: Identifiable[] = [
  { uid: 'Credito', name: 'Crédito' },
  { uid: 'Contado', name: 'Contado' },
];


export enum OrderQueryType {
  Sales              = 'SalesOrders',
  SalesAuthorization = 'SalesOrdersAuthorization',
  SalesPacking       = 'SalesOrdersPacking',
}


export interface OrderQuery {
  queryType: OrderQueryType;
  keywords: string;
  fromDate: DateString;
  toDate: DateString;
  status: string;
}


export const EmptyOrderQuery: OrderQuery = {
  queryType: OrderQueryType.Sales,
  keywords: null,
  fromDate: null,
  toDate: null,
  status: null,
}


export interface OrderDescriptor {
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
}


export interface OrderGeneralData extends OrderAdditionalData {
  uid?: string;
  orderNumber: string;
  orderTime: DateString;
  status: string;
  statusName: string;
  customer: Customer;
  customerContact: Contact;
  salesAgent: Party;
  supplier: Party;
  paymentCondition: string;
  shippingMethod: string;
  priceList: string;
  notes?: string;
}


export interface OrderAdditionalData {
  notes?: string;
}


export interface OrderTotals {
  itemsCount: number;
  itemsTotal: number;
  shipment: number;
  discount: number;
  taxes: number;
  orderTotal: number;
}


export interface OrderData extends OrderGeneralData, OrderAdditionalData, OrderTotals {

}


export interface Authorization {
  authorizationStatus: string;
  authorizationTime: DateString;
}


export interface Order {
  orderData: OrderData;
  items: OrderItem[];
  authorization: Authorization;
  customerCredit: CustomerCredit;
  shipping: ShippingData;
  packing: Packing;
  actions: OrderActions;
}


export interface OrderActions {
  canEdit: boolean;
  canApply: boolean;
  canAuthorize: boolean;
  canPackaging: boolean;
  canSelectCarrier: boolean;
  canShipping: boolean;
  canClose: boolean;
}


export const EmptyOrderActions: OrderActions = {
  canEdit: false,
  canApply: false,

  canAuthorize: false,
  canPackaging: false,
  canSelectCarrier: false,
  canShipping: false,
  canClose: false,
};


export interface OrderItem {
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


export interface OrderFields {
  uid?: string;
  orderNumber: string;
  orderTime: DateString;
  status: string;
  customerUID: string;
  customerContactUID: string;
  salesAgentUID: string;
  supplierUID: string;
  paymentCondition: string;
  shippingMethod: string;
  priceList: string;
  notes: string;
  items: OrderItemFields[];
}


export interface OrderItemFields {
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


export function mapOrderDescriptorFromOrder(order: Order): OrderDescriptor {
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
  };
}


export const EmptyOrderGeneralData: OrderGeneralData = {
  uid: null,
  orderNumber: '',
  orderTime: '',
  shippingMethod: '',
  status: '',
  statusName: '',
  customer: EmptyCustomer,
  customerContact: EmptyContact,
  supplier: Empty,
  salesAgent: Empty,
  paymentCondition: '',
  priceList: '',
  notes: '',
}


export const EmptyOrderAdditionalData: OrderAdditionalData = {
  notes: '',
}


export const EmptyOrderTotals: OrderTotals = {
  itemsCount: 0,
  itemsTotal: 0,
  shipment: 0,
  discount: 0,
  taxes: 0,
  orderTotal: 0,
}


export const EmptyOrderData: OrderData = {
  uid: null,
  orderNumber: '',
  orderTime: '',
  notes: '',
  shippingMethod: '',
  status: '',
  statusName: '',
  customer: EmptyCustomer,
  customerContact: EmptyContact,
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
}


export const EmptyAuthorization: Authorization = {
  authorizationStatus: '',
  authorizationTime: '',
}


export function EmptyOrder(): Order {

  return clone<Order>({
    orderData: EmptyOrderData,
    items: [],
    authorization: EmptyAuthorization,
    customerCredit: EmptyCustomerCredit,
    shipping: EmptyShippingData,
    packing: EmptyPacking,
    actions: EmptyOrderActions,
  });

}


export function mapOrderFieldsFromOrder(order: Order): OrderFields {
  const orderFields: OrderFields = {
    uid: order.orderData.uid,
    orderNumber: order.orderData.orderNumber,
    orderTime: order.orderData.orderTime,
    status: order.orderData.status,
    customerUID: order.orderData.customer?.uid ?? '',
    customerContactUID: order.orderData.customerContact?.uid ?? '',
    salesAgentUID: order.orderData.salesAgent?.uid ?? '',
    supplierUID: order.orderData.supplier?.uid ?? '',
    paymentCondition: order.orderData.paymentCondition,
    shippingMethod: order.orderData.shippingMethod,
    priceList: order.orderData.priceList,
    items: order.items.map(x => mapOrderItemFieldsFromOrderItem(x)),
    notes: order.orderData.notes,
  };

  return orderFields;
}


export function mapOrderItemFieldsFromOrderItem(orderItem: OrderItem): OrderItemFields {
  const orderFields: OrderItemFields = {
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


export function mapOrderItemFromProductSelection(product: ProductSelection): OrderItem {
  const productForSeeker: OrderItem = {
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


export enum OrdersOperationType {
  selectParcelDelivery = 'select-parcel-delivery',
  cancel               = 'cancel',
  print                = 'print',
}


export interface OrdersOperation extends Identifiable {
  uid: string;
  name: string;
}


export const OrdersOperationList: OrdersOperation[] = [
  { uid: OrdersOperationType.selectParcelDelivery, name: 'Seleccionar paqueteria' },
  { uid: OrdersOperationType.print,                name: 'Imprimir' },
  { uid: OrdersOperationType.cancel,               name: 'Cancelar' },
];
