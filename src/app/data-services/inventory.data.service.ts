/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { InventoryOrderFields, InventoryOrderHolder, InventoryOrderItemEntryFields, InventoryOrderItemFields,
         OrdersDataTable, OrdersQuery } from '@app/models';


@Injectable()
export class InventoryDataService {


  constructor(private http: HttpService) { }


  getOrderTypes(): EmpObservable<Identifiable[]> {
    const path = 'v8/order-management/inventory-types';

    return this.http.get<Identifiable[]>(path);
  }


  getWareHouses(): EmpObservable<Identifiable[]> {
    const path = 'v8/order-management/wareHouses';

    return this.http.get<Identifiable[]>(path);
  }


  getWarehousemen(): EmpObservable<Identifiable[]> {
    const path = 'v8/order-management/inventory-orders/warehousemen';

    return this.http.get<Identifiable[]>(path);
  }


  getSupervisors(): EmpObservable<Identifiable[]> {
    const path = 'v8/order-management/inventory-orders/inventory-supervisor';

    return this.http.get<Identifiable[]>(path);
  }


  searchOrders(query: OrdersQuery): EmpObservable<OrdersDataTable> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/order-management/inventory-orders/search';

    return this.http.post<OrdersDataTable>(path, query);
  }


  getOrder(orderUID: string): EmpObservable<InventoryOrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/inventory-orders/${orderUID}`;

    return this.http.get<InventoryOrderHolder>(path);
  }


  createOrder(dataFields: InventoryOrderFields): EmpObservable<InventoryOrderHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = 'v8/order-management/inventory-orders/';

    return this.http.post<InventoryOrderHolder>(path, dataFields);
  }


  updateOrder(orderUID: string,
              dataFields: InventoryOrderFields): EmpObservable<InventoryOrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/inventory-orders/${orderUID}`;

    return this.http.put<InventoryOrderHolder>(path, dataFields);
  }


  deleteOrder(orderUID: string): EmpObservable<InventoryOrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/inventory-orders/${orderUID}`;

    return this.http.delete<InventoryOrderHolder>(path);
  }


  closeOrder(orderUID: string): EmpObservable<InventoryOrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/inventory-orders/${orderUID}/close`;

    return this.http.post<InventoryOrderHolder>(path);
  }


  closeOrderEntries(orderUID: string): EmpObservable<InventoryOrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/inventory-orders/${orderUID}/close-entries`;

    return this.http.post<InventoryOrderHolder>(path);
  }


  createOrderItem(orderUID: string,
                  dataFields: InventoryOrderItemFields): EmpObservable<InventoryOrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/inventory-orders/${orderUID}/items`;

    return this.http.post<InventoryOrderHolder>(path, dataFields);
  }


  deleteOrderItem(orderUID: string,
                  itemUID: string): EmpObservable<InventoryOrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(itemUID, 'itemUID');

    const path = `v8/order-management/inventory-orders/${orderUID}/items/${itemUID}`;

    return this.http.delete<InventoryOrderHolder>(path);
  }


  assignOrderItemEntry(orderUID: string,
                       itemUID: string,
                       dataFields: InventoryOrderItemEntryFields): EmpObservable<InventoryOrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(itemUID, 'itemUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/inventory-orders/${orderUID}/items/${itemUID}/entries`;

    return this.http.post<InventoryOrderHolder>(path, dataFields);
  }


  removeOrderItemEntry(orderUID: string,
                       itemUID: string,
                       entryUID: string): EmpObservable<InventoryOrderHolder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(itemUID, 'itemUID');
    Assertion.assertValue(entryUID, 'entryUID');

    const path = `v8/order-management/inventory-orders/${orderUID}/items/${itemUID}/entries/${entryUID}`;

    return this.http.delete<InventoryOrderHolder>(path);
  }

}
