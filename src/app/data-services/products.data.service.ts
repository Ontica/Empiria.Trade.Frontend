/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { ProductDescriptor, ProductQuery } from '@app/models';


@Injectable()
export class ProductsDataService {

  constructor(private http: HttpService) { }


  searchProducts(query: ProductQuery): EmpObservable<ProductDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/products/search-products';

    return this.http.post<ProductDescriptor[]>(path, query);
  }


  searchProductsForSaleOrder(query: ProductQuery): EmpObservable<ProductDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/products/search-products-for-sale-order';

    return this.http.post<ProductDescriptor[]>(path, query);
  }


  searchProductsForPurchaseOrder(query: ProductQuery): EmpObservable<ProductDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/products/search-products-for-purchase-order';

    return this.http.post<ProductDescriptor[]>(path, query);
  }


  searchProductsForInventory(query: ProductQuery): EmpObservable<ProductDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/products/search-products-for-inventory';

    return this.http.post<ProductDescriptor[]>(path, query);
  }

}
