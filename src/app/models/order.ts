/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { clone } from '@app/shared/utils';

import { Contact, Customer, Party, EmptyCustomer, EmptyContact, Address, EmptyAddress } from './contacts';

import { Presentation, Product, ProductSelection, Vendor } from './product';

import { CustomerCredit, EmptyCustomerCredit } from './customer';

import { EmptyPacking, Packing } from './packing';

import { EmptyShippingData, ShippingData } from './shipping';

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './data-table';


export interface OrderTypeConfig {
  type: OrderQueryType;
  titleText: string;
  itemText: string;
  canAdd?: boolean;
}


export const DefaultOrderStatus: string = 'Captured';


export enum ShippingMethodTypes {
  RutaLocal   = 'RutaLocal',
  RutaForanea = 'RutaForanea',
  Ocurre      = 'Ocurre',
  Paqueteria  = 'Paqueteria',
}


export const ShippingMethodList: Identifiable[] = [
  { uid: ShippingMethodTypes.RutaLocal, name: 'Ruta local' },
  { uid: ShippingMethodTypes.RutaForanea, name: 'Ruta foránea' },
  { uid: ShippingMethodTypes.Ocurre, name: 'Ocurre' },
  { uid: ShippingMethodTypes.Paqueteria, name: 'Paquetería' },
];


export const PaymentConditionList: Identifiable[] = [
  { uid: 'Credito', name: 'Crédito' },
  { uid: 'Contado', name: 'Contado' },
];


export enum OrderQueryType {
  Sales              = 'Sales',
  SalesAuthorization = 'SalesAuthorization',
  SalesPacking       = 'SalesPacking',
  SalesShipping      = 'SalesShipping',
}


export interface OrderQuery extends DataTableQuery {
  queryType: OrderQueryType;
  keywords: string;
  fromDate: DateString;
  toDate: DateString;
  status: string;
  shippingMethod: string;
  customerUID: string;
}


export interface OrderDescriptor extends DataTableEntry {
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
  shipment: string;
}


export interface OrderDataTable extends DataTable {
  query: OrderQuery;
  columns: DataTableColumn[];
  entries: OrderDescriptor[];
}


export const EmptyOrderQuery: OrderQuery = {
  queryType: OrderQueryType.Sales,
  keywords: null,
  fromDate: null,
  toDate: null,
  status: null,
  shippingMethod: null,
  customerUID: null,
};


export const EmptyOrderDataTable: OrderDataTable = {
  query: EmptyOrderQuery,
  columns: [],
  entries: [],
};


export interface OrderGeneralData extends OrderAdditionalData {
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
  can: {
    update: boolean;
    cancel: boolean;
    apply: boolean;
    authorize: boolean;
    editPacking: boolean;
    closePacking: boolean;
    editShipping: boolean;
    sendShipping: boolean;
  };
  show: {
    orderData: boolean;
    creditData: boolean;
    packingData: boolean;
    shippingData: boolean;
    sendShippingData: boolean;
  };
}


export const EmptyOrderActions: OrderActions = {
  can: {
    update: false,
    cancel: false,
    apply: false,
    authorize: false,
    editPacking: false,
    closePacking: false,
    editShipping: false,
    sendShipping: false,
  },
  show: {
    orderData: false,
    creditData: false,
    packingData: false,
    shippingData: false,
    sendShippingData: false,
  },
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
  customerAddressUID: string;
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
    shipment: 'Pendiente',
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
  customerAddress: EmptyAddress,
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
    customerAddressUID: order.orderData.customerAddress?.uid ?? '',
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


export function getQueryForSearchOrders(keywords: string): OrderQuery {
  const query: OrderQuery ={ ...EmptyOrderQuery,  ...{
      queryType: OrderQueryType.Sales,
      status: 'Shipping',
      shippingMethod: ShippingMethodTypes.Paqueteria,
      keywords: keywords,
    }};

  return query;
}


export enum OrdersOperationType {
  parcel_delivery        = 'parcel-delivery',
  customer_delivery      = 'customer-delivery',
  local_route_delivery   = 'local-route-delivery',
  local_foreign_delivery = 'local-foreign-delivery',
  cancel                 = 'cancel',
  print                  = 'print',
}


export interface OrdersOperation extends Identifiable {
  uid: string;
  name: string;
}


export const OrdersOperationList: OrdersOperation[] = [
  { uid: OrdersOperationType.parcel_delivery,        name: 'Enviar por paquetería' },
  { uid: OrdersOperationType.customer_delivery,      name: 'Entrega por ocurre' },
  { uid: OrdersOperationType.local_route_delivery,   name: 'Enviar por ruta local' },
  { uid: OrdersOperationType.local_foreign_delivery, name: 'Enviar por ruta foránea' },
  { uid: OrdersOperationType.print,                  name: 'Imprimir' },
  { uid: OrdersOperationType.cancel,                 name: 'Cancelar' },
];
