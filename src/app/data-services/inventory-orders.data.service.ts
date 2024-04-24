/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { InventoryOrderDescriptor, InventoryOrderQuery } from '@app/models';


@Injectable()
export class InventoryOrdersDataService {

  constructor(private http: HttpService) { }


  getInventoryOrderTypes(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/inventory/orders/inventory-types';

    return this.http.get<Identifiable[]>(path);
  }


  searchInventoryOrders(query: InventoryOrderQuery): EmpObservable<InventoryOrderDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/inventory/orders/search';

    return this.http.post<InventoryOrderDescriptor[]>(path, query);
  }

}
