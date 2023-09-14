/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { Product, ProductQuery } from '@app/models';


@Injectable()
export class ProductsDataService {

  constructor(private http: HttpService) { }


  searchProducts(query: ProductQuery): EmpObservable<Product[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/products/products-list';

    return this.http.post<Product[]>(path, query);
  }

}
