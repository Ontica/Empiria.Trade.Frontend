/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { Shipping, ShippingData, ShippingDataFields, ShippingQuery } from '@app/models';

@Injectable()
export class ShippingDataService {


  constructor(private http: HttpService) { }


  getParcelSuppliers(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/shipping-and-handling/shipping/parcel-suppliers';

    return this.http.get<Identifiable[]>(path);
  }


  getShippingByOrders(query: ShippingQuery): EmpObservable<Shipping> {
    const path = 'v4/trade/sales/shipping/parcel-delivery';

    return this.http.post<Shipping>(path, query);
  }


  updateOrderShipping(orderUID: string,
                      shippingFields: ShippingDataFields): EmpObservable<ShippingData> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(shippingFields, 'shippingFields');

    const path = `v4/trade/shipping-and-handling/shipping/${orderUID}`;

    return this.http.post<ShippingData>(path, shippingFields);
  }

}
