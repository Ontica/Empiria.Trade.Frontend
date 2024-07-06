/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { OrdersDataTable, PurchaseOrder, PurchaseOrderFields, PurchaseOrdersQuery } from '@app/models';


@Injectable()
export class PurchasesDataService {

  constructor(private http: HttpService) { }


  getOrderStatus(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/procurement/purchase-orders/status';

    return this.http.get<Identifiable[]>(path);
  }


  searchOrders(query: PurchaseOrdersQuery): EmpObservable<OrdersDataTable> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/procurement/purchase-orders/search';

    return this.http.post<OrdersDataTable>(path, query);
  }


  createOrder(dataFields: PurchaseOrderFields): EmpObservable<PurchaseOrder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = 'v4/trade/procurement/purchase-orders';

    return this.http.post<PurchaseOrder>(path, dataFields);
  }
}
