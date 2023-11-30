/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Presentation, Product, Vendor } from "./product";


export interface Packing {
  data: PackingData;
  packagedItems: PackingItem[];
  missingItems: MissingItem[];
}


export interface PackingData {
  orderUID: string;
  size: number;
  count: number;
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


export interface MissingItem {
  orderItemUID: string;
  product: Product;
  presentation: Presentation;
  vendor: Vendor;
  warehouses: Warehouse[];
  warehouseBins: WarehouseBin[];
  quantity: number;
}


export interface MissingItemField {
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


export const EmptyPacking: Packing = {
  data: {
    orderUID: '',
    count: 0,
    size: 0,
  },
  packagedItems: [],
  missingItems: [],
}
