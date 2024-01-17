/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { Shipping, ShippingFields } from '@app/models';

@Injectable()
export class ShippingDataService {


  constructor(private http: HttpService) { }


  getParcelSuppliers(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/shipping-and-handling/shipping/parcel-suppliers';

    return this.http.get<Identifiable[]>(path);
  }


  updateOrderShipping(orderUID: string,
                      shippingFields: ShippingFields): EmpObservable<Shipping> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(shippingFields, 'shippingFields');

    const path = `v4/trade/shipping-and-handling/shipping/${orderUID}`;

    return this.http.post<Shipping>(path, shippingFields);
  }

}