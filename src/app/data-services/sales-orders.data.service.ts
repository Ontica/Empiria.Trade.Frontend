/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { Order, OrderFields, OrderQuery } from '@app/models';


@Injectable()
export class SalesOrdersDataService {

  constructor(private http: HttpService) { }


  searchOrders(query: OrderQuery): EmpObservable<Order[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/sales/search-sales-order';

    return this.http.post<Order[]>(path, query);
  }


  calculateOrder(orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderFields, 'orderFields');

    const path = `v4/trade/sales/process-sales-order`;

    return this.http.post<Order>(path, orderFields);
  }


  createOrder(orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderFields, 'orderFields');

    const path = 'v4/trade/sales/create-sales-order';

    return this.http.post<Order>(path, orderFields);
  }


  updateOrder(orderUID: string, orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(orderFields, 'orderFields');

    const path = `v4/trade/sales/orders/${orderUID}`;

    return this.http.put<Order>(path, orderFields);
  }


  applyOrder(orderUID: string, orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(orderFields, 'orderFields');

    const path = `v4/trade/sales/orders/${orderUID}/apply`;

    return this.http.post<Order>(path, orderFields);
  }


  cancelOrder(orderUID: string, orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(orderFields, 'orderFields');

    const path = `v4/trade/sales/orders/${orderUID}/cancel`;

    return this.http.delete<Order>(path, orderFields);
  }

}
