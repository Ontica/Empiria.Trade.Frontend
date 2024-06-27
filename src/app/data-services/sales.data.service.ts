/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { SaleOrder, OrdersDataTable, SaleOrderFields, SalesOrdersQuery } from '@app/models';


@Injectable()
export class SalesDataService {

  constructor(private http: HttpService) { }


  getOrderStatus(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/sales/orders/status';

    return this.http.get<Identifiable[]>(path);
  }


  getOrderStatusForAuthorizations(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/sales/orders/status/authorizations';

    return this.http.get<Identifiable[]>(path);
  }


  getOrderStatusForPacking(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/sales/orders/status/packing';

    return this.http.get<Identifiable[]>(path);
  }


  searchOrders(query: SalesOrdersQuery): EmpObservable<OrdersDataTable> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/sales/orders/search';

    return this.http.post<OrdersDataTable>(path, query);
  }


  getOrder(orderUID: string, queryType: string): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(queryType, 'queryType');

    const path = `v4/trade/sales/orders/${orderUID}/${queryType}`;

    return this.http.get<SaleOrder>(path);
  }


  calculateOrder(dataFields: SaleOrderFields): EmpObservable<SaleOrder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/trade/sales/orders/process`;

    return this.http.post<SaleOrder>(path, dataFields);
  }


  createOrder(dataFields: SaleOrderFields): EmpObservable<SaleOrder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = 'v4/trade/sales/orders';

    return this.http.post<SaleOrder>(path, dataFields);
  }


  updateOrder(orderUID: string, dataFields: SaleOrderFields): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/trade/sales/orders/${orderUID}`;

    return this.http.put<SaleOrder>(path, dataFields);
  }


  applyOrder(orderUID: string): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/orders/${orderUID}/apply`;

    return this.http.post<SaleOrder>(path);
  }


  authorizeOrder(orderUID: string): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/orders/${orderUID}/authorize`;

    return this.http.post<SaleOrder>(path);
  }



  deauthorizeOrder(orderUID: string, notes: string): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(notes, 'notes');

    const path = `v4/trade/sales/orders/${orderUID}/deauthorize`;

    return this.http.post<SaleOrder>(path, {notes});
  }


  supplyOrder(orderUID: string): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/orders/${orderUID}/supply`;

    return this.http.post<SaleOrder>(path);
  }


  cancelOrder(orderUID: string): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/orders/${orderUID}/cancel`;

    return this.http.delete<SaleOrder>(path);
  }

}
