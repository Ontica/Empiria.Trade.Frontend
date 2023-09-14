/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export interface ProductQuery {
  keywords: string;
}


export interface ProductForSeeker {
  product: Product;
  selectedPresentation: ProductPresentation;
  showAllVendors: boolean;
}


export interface Product {
  productUID: string;
  code: string;
  description: string;
  productType: ProductType;
  presentations: ProductPresentation[];

}


export interface ProductType {
  productTypeUID: string;
  name: string;
  attributes: ProductAttributes[];
}



export interface ProductAttributes {
  name: string;
  value: string;
}


export interface ProductPresentation {
  presentationUID: string;
  description: string;
  units: number;
  vendors: Vendor[];
}


export interface Vendor {
  vendorUID: string;
  vendorName: string;
  sku: string;
  stock: number;
  price: number;
}


export function mapProductForSeekerFromProduct(product: Product) {
  const productForSeeker: ProductForSeeker = {
    product,
    selectedPresentation: product.presentations[0] ?? null,
    showAllVendors: false,
  };

  return productForSeeker;
}
