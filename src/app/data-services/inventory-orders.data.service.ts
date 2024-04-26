/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { InventoryOrder, InventoryOrderDataTable, InventoryOrderQuery } from '@app/models';


@Injectable()
export class InventoryOrdersDataService {

  constructor(private http: HttpService) { }


  getInventoryOrderTypes(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/inventory/orders/inventory-types';

    return this.http.get<Identifiable[]>(path);
  }


  searchInventoryOrders(query: InventoryOrderQuery): EmpObservable<InventoryOrderDataTable> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/inventory/orders/search';

    return this.http.post<InventoryOrderDataTable>(path, query);
  }


  getInventoryOrder(inventoryOrderUID: string): EmpObservable<InventoryOrder> {
    Assertion.assertValue(inventoryOrderUID, 'inventoryOrderUID');

    const path = `v4/trade/inventory/orders/${inventoryOrderUID}`;

    return this.http.get<InventoryOrder>(path);
  }

}
