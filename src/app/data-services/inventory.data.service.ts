/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { InventoryOrder, OrdersDataTable, InventoryOrderFields, InventoryOrderItemFields, OrderHolder,
         OrdersQuery, OrderItemEntry } from '@app/models';


@Injectable()
export class InventoryDataService {

  constructor(private http: HttpService) { }


  getOrderTypes(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/inventory/orders/inventory-types';

    return this.http.get<Identifiable[]>(path);
  }


  searchOrders(query: OrdersQuery): EmpObservable<OrdersDataTable> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/order-management/inventory-orders/search';

    return this.http.post<OrdersDataTable>(path, query);
  }


  getOrder(orderUID: string): EmpObservable<OrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/inventory-orders/${orderUID}`;

    return this.http.get<OrderHolder>(path);
  }


  closeOrderEntries(orderUID: string): EmpObservable<OrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/inventory-orders/${orderUID}/close`;

    return this.http.post<OrderHolder>(path);
  }


  assignOrderItemEntry(orderUID: string,
                       itemUID: string,
                       dataFields: OrderItemEntry): EmpObservable<OrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(itemUID, 'itemUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/inventory-orders/${orderUID}/items/${itemUID}/entries`;

    return this.http.post<OrderHolder>(path, dataFields);
  }


  removeOrderItemEntry(orderUID: string,
                       itemUID: string,
                       entryUID: string): EmpObservable<OrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(itemUID, 'itemUID');
    Assertion.assertValue(entryUID, 'entryUID');

    const path = `v8/order-management/inventory-orders/${orderUID}/items/${itemUID}/entries/${entryUID}`;

    return this.http.delete<OrderHolder>(path);
  }

  //
  // TODO: Refactor the following functions
  //

  createOrder(dataFields: InventoryOrderFields): EmpObservable<InventoryOrder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = 'v4/trade/inventory/orders/';

    return this.http.post<InventoryOrder>(path, dataFields);
  }


  updateOrder(orderUID: string,
              dataFields: InventoryOrderFields): EmpObservable<InventoryOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/trade/inventory/orders/${orderUID}`;

    return this.http.put<InventoryOrder>(path, dataFields);
  }


  deleteOrder(orderUID: string): EmpObservable<InventoryOrder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/inventory/orders/${orderUID}`;

    return this.http.delete<InventoryOrder>(path);
  }


  closeOrder(orderUID: string): EmpObservable<InventoryOrder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/inventory/orders/${orderUID}/close`;

    return this.http.post<InventoryOrder>(path);
  }


  createOrderItem(orderUID: string,
                  dataFields: InventoryOrderItemFields): EmpObservable<InventoryOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/trade/inventory/orders/${orderUID}/item`;

    return this.http.post<InventoryOrder>(path, dataFields);
  }


  deleteOrderItem(orderUID: string,
                  orderItemUID: string): EmpObservable<InventoryOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(orderItemUID, 'orderItemUID');

    const path = `v4/trade/inventory/orders/${orderUID}/item/${orderItemUID}`;

    return this.http.delete<InventoryOrder>(path);
  }

}
