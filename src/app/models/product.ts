/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { OrderFields } from './order';

import { WarehouseBinForInventory } from './warehouse';


export interface Product {
  productUID: string;
  productCode: string;
  description: string;
  productType: ProductType;
  productImageUrl: string;
}


export interface ProductType {
  productTypeUID: string;
  name: string;
  attributes: Attributes[];
}


export interface Attributes {
  name: string;
  value: string;
}


export interface Presentation {
  presentationUID: string;
  description: string;
  units: number;
}


export interface Vendor {
  vendorUID: string;
  vendorName: string;
  sku: string;
  vendorProductUID: string;
  stock: number;
  price: number;
}


export interface ProductQuery {
  keywords: string;
  onStock: boolean;
  order?: OrderFields;
}


export interface ProductSelection {
  product: ProductDescriptor;
  presentation: ProductPresentation;
  vendor: Vendor;
  quantity: number,
}


export interface InventoryProductSelection {
  product: ProductDescriptor;
  presentation: ProductPresentation;
  vendor: Vendor;
  warehouseBin: WarehouseBinForInventory;
  position: number;
  level: number;
  quantity: number,
  notes: string;
}


export interface ProductDescriptor extends Product {
  productUID: string;
  productCode: string;
  description: string;
  productType: ProductType;
  productImageUrl: string;
  presentations: ProductPresentation[];
}


export interface ProductPresentation extends Presentation {
  presentationUID: string;
  description: string;
  units: number;
  vendors: Vendor[];
}
