/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { OrderForShipping, Shipping, ShippingFields, ShippingQuery } from '@app/models';

@Injectable()
export class ShippingDataService {


  constructor(private http: HttpService) { }


  getParcelSuppliers(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/sales/shipping/parcel-suppliers';

    return this.http.get<Identifiable[]>(path);
  }


  getShippingByOrders(query: ShippingQuery): EmpObservable<Shipping> {
    const path = 'v4/trade/sales/shipping/parcel-delivery';

    return this.http.post<Shipping>(path, query);
  }


  getOrdersForShipping(keywords: string): EmpObservable<OrderForShipping[]> {
    Assertion.assertValue(keywords, 'keywords');

    const path = `v4/trade/sales/shipping/orders/?keywords=${keywords}`;

    return this.http.get<OrderForShipping[]>(path);
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

}
