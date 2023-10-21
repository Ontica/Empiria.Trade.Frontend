/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { delay, of, tap } from 'rxjs';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { Order, OrderFields, OrderQuery } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';


@Injectable()
export class SalesOrdersDataService {

  constructor(private http: HttpService,
              private messageBox: MessageBoxService) { }


  searchOrders(query: OrderQuery): EmpObservable<Order[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/sales/search-sales-order';

    return this.http.post<Order[]>(path, query);
  }


  createOrder(orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderFields, 'orderFields');

    const path = 'v4/trade/sales/create-sales-order';

    return this.http.post<Order>(path, orderFields);
  }


  updateOrder(orderUID: string, orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(orderFields, 'orderFields');

    const path = `v4/trade/sales/update-sales-order/${orderUID}`;

    return new EmpObservable(
      of(null).pipe(
        delay(1000),
        tap(x => this.messageBox.showInDevelopment('Actualizar Pedido', { path: path, order: orderFields }))
      )
    );
    // this.http.put<Order>(path, orderFields);
  }


  deleteOrder(orderUID: string): EmpObservable<Order> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/delete-sales-order/${orderUID}`;

    return new EmpObservable(
      of(null).pipe(
        delay(1000),
        tap(x => this.messageBox.showInDevelopment('Eliminar Pedido', { path: path, order: orderUID }))
      )
    );

    //this.http.delete<Order>(path);
  }


  calculateOrderData(orderFields: OrderFields): EmpObservable<Order> {
    Assertion.assertValue(orderFields, 'orderFields');

    const path = `v4/trade/sales/process-sales-order`;

    return this.http.post<Order>(path, orderFields);
  }

}
