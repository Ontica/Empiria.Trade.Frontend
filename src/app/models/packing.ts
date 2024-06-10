/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Presentation, Product, Vendor } from './product';

import { EmptyInventoryPicking, InventoryPicking } from './inventory-order';

import { OrderItemData } from './order';


export interface Packing {
  picking: InventoryPicking;
  data: PackingData;
  packagedItems: PackingItem[];
  missingItems: MissingItem[];
}


export interface PackingData extends PackagingTotals {
  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
  packingTypesData: PackingTypeData[];
}


export interface PackagingTotals {
  ordersCount?: number;
  ordersTotal?: number;

  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
}


export interface PackingTypeData {
  packageTypeUID: string;
  packageTypeName: string;
  packages: number;
}


export interface PackingItem {
  uid: string;
  orderUID: string;
  packageID: string;
  packageTypeUID: string;
  packageTypeName: string;
  orderItems: PackingOrderItem[];
}


export interface PackingItemFields {
  orderUID: string;
  packageID: string;
  packageTypeUID: string;
}


export interface PackingOrderItem {
  uid: string;
  orderItemUID: string;
  product: Product;
  presentation: Presentation;
  vendor: Vendor;
  warehouse: Warehouse;
  warehouseBin: WarehouseBin;
  quantity: number;
}


export interface MissingItem extends OrderItemData {
  orderItemUID: string;
  product: Product;
  presentation: Presentation;
  vendor: Vendor;
  quantity: number;
  warehouses: Warehouse[];
  warehouseBins: WarehouseBin[];
}


export interface PackingOrderItemField {
  orderItemUID: string;
  warehouseBinUID: string;
  warehouseUID?: string;
  quantity: number;
}


export interface Warehouse {
  uid: string;
  code: string;
  name: string;
  stock?: number;
}


export interface WarehouseBin {
  uid: string;
  name: string;
  warehouseName:string;
  stock?: number;
}


export const EmptyPackagingTotals: PackagingTotals = {
  totalPackages: 0,
  totalWeight: 0,
  totalVolume: 0,
}


export const EmptyPackingData: PackingData = {
  totalPackages: 0,
  totalWeight: 0,
  totalVolume: 0,
  packingTypesData: [],
};


export const EmptyPacking: Packing = {
  picking: EmptyInventoryPicking,
  data: EmptyPackingData,
  packagedItems: [],
  missingItems: [],
}
