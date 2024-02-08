/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { map } from 'rxjs';

import { OrderDescriptor, OrderForShipping, OrderQuery, Shipping, ShippingFields, ShippingFieldsQuery,
         mapOrdersDescriptorToOrdersForShipping } from '@app/models';

@Injectable()
export class ShippingDataService {


  constructor(private http: HttpService) { }


  getParcelSuppliers(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/sales/shipping/parcel-suppliers';

    return this.http.get<Identifiable[]>(path);
  }


  getShippingByOrders(query: ShippingFieldsQuery): EmpObservable<Shipping> {
    const path = 'v4/trade/sales/shipping/parcel-delivery';

    return this.http.post<Shipping>(path, query);
  }



  searchOrdersForShipping(query: OrderQuery): EmpObservable<OrderForShipping[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/sales/orders/search';

    return new EmpObservable<OrderForShipping[]> (
      this.http.post<OrderDescriptor[]>(path, query).pipe(map(x => mapOrdersDescriptorToOrdersForShipping(x)))
    );
  }


  createShipping(shippingFields: ShippingFields): EmpObservable<Shipping> {
    Assertion.assertValue(shippingFields, 'shippingFields');

    const path = `v4/trade/sales/shipping/`;

    return this.http.post<Shipping>(path, shippingFields);
  }


  updateShipping(shippingUID: string, shippingFields: ShippingFields): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');
    Assertion.assertValue(shippingFields, 'shippingFields');

    const path = `v4/trade/sales/shipping/${shippingUID}`;

    return this.http.put<Shipping>(path, shippingFields);
  }


  AddOrderToShipping(shippingUID: string, orderUID: string): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/shipping/${shippingUID}/order/${orderUID}`;

    return this.http.post<Shipping>(path);
  }



  removeOrderFromShipping(shippingUID: string, orderUID: string): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/shipping/${shippingUID}/order/${orderUID}`;

    return this.http.delete<Shipping>(path);
  }


  sendShipment(shippingUID: string): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');

    const path = `v4/trade/sales/shipping/${shippingUID}/send`;

    return this.http.post<Shipping>(path);
  }

}
