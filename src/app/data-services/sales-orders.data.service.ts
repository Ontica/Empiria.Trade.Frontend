/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { Order, OrderFields, OrderQuery } from '@app/models';


@Injectable()
export class SalesOrdersDataService {

  constructor(private http: HttpService) { }


  getOrderStatus(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/sales/orders/status';

    return this.http.get<Identifiable[]>(path);
  }


  getOrderStatusForAuthorizations(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/sales/orders/status/authorizations';

    return this.http.get<Identifiable[]>(path);
  }


  searchOrders(query: OrderQuery): EmpObservable<Order[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/sales/orders/search';

    return this.http.post<Order[]>(path, query);
  }


  calculateOrder(orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderFields, 'orderFields');

    const path = `v4/trade/sales/orders/process`;

    return this.http.post<Order>(path, orderFields);
  }


  createOrder(orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderFields, 'orderFields');

    const path = 'v4/trade/sales/orders';

    return this.http.post<Order>(path, orderFields);
  }


  updateOrder(orderUID: string, orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(orderFields, 'orderFields');

    const path = `v4/trade/sales/orders/${orderUID}`;

    return this.http.put<Order>(path, orderFields);
  }


  applyOrder(orderUID: string): EmpObservable<Order> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/orders/${orderUID}/apply`;

    return this.http.post<Order>(path);
  }


  authorizeOrder(orderUID: string): EmpObservable<Order> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/orders/${orderUID}/authorize`;

    return this.http.post<Order>(path);
  }


  cancelOrder(orderUID: string): EmpObservable<Order> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/orders/${orderUID}/cancel`;

    return this.http.delete<Order>(path);
  }

}