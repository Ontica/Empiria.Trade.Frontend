/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { Shipping, ShippingData, ShippingFields, ShippingFieldsQuery, ShippingPalletFields,
         ShippingQuery, ShippingQueryType } from '@app/models';

@Injectable()
export class ShippingDataService {


  constructor(private http: HttpService) { }


  getParcelSuppliers(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/sales/shipping/parcel-suppliers';

    return this.http.get<Identifiable[]>(path);
  }


  searchShipping(query: ShippingQuery): EmpObservable<ShippingData[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/sales/shipping/search';

    return this.http.post<ShippingData[]>(path, query);
  }


  getShipping(queryType: ShippingQueryType, shippingUID: string): EmpObservable<Shipping> {
    const path = `v4/trade/sales/shipping/${queryType}/${shippingUID}`;

    return this.http.get<Shipping>(path);
  }


  getShippingByOrders(query: ShippingFieldsQuery): EmpObservable<Shipping> {
    const path = 'v4/trade/sales/shipping/by-orders';

    return this.http.post<Shipping>(path, query);
  }


  createShipping(dataFields: ShippingFields): EmpObservable<Shipping> {
    Assertion.assertValue(dataFields, 'shippingFields');

    const path = `v4/trade/sales/shipping/`;

    return this.http.post<Shipping>(path, dataFields);
  }


  updateShipping(shippingUID: string,
                 dataFields: ShippingFields): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/trade/sales/shipping/${shippingUID}`;

    return this.http.put<Shipping>(path, dataFields);
  }


  deleteShipping(shippingUID: string): EmpObservable<void> {
    Assertion.assertValue(shippingUID, 'shippingUID');

    const path = `v4/trade/sales/shipping/${shippingUID}`;

    return this.http.delete<void>(path);
  }


  AddOrderToShipping(shippingUID: string,
                     orderUID: string): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/shipping/${shippingUID}/order/${orderUID}`;

    return this.http.post<Shipping>(path);
  }


  removeOrderFromShipping(shippingUID: string,
                          orderUID: string): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/shipping/${shippingUID}/order/${orderUID}`;

    return this.http.delete<Shipping>(path);
  }


  createShippingPallet(shippingUID: string,
                       dataFields: ShippingPalletFields): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/trade/sales/shipping/${shippingUID}/pallet`;

    return this.http.post<Shipping>(path, dataFields);
  }


  updateShippingPallet(shippingUID: string,
                       shippingPalletUID: string,
                       dataFields: ShippingPalletFields): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');
    Assertion.assertValue(shippingPalletUID, 'shippingPalletUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/trade/sales/shipping/${shippingUID}/pallet/${shippingPalletUID}`;

    return this.http.put<Shipping>(path, dataFields);
  }


  deleteShippingPallet(shippingUID: string,
                       shippingPalletUID: string): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');
    Assertion.assertValue(shippingPalletUID, 'shippingPalletUID');

    const path = `v4/trade/sales/shipping/${shippingUID}/pallet/${shippingPalletUID}`;

    return this.http.delete<Shipping>(path);
  }


  closeShippingEdition(shippingUID: string): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');

    const path = `v4/trade/sales/shipping/${shippingUID}/close-edition`;

    return this.http.post<Shipping>(path);
  }


  closeShipping(shippingUID: string): EmpObservable<Shipping> {
    Assertion.assertValue(shippingUID, 'shippingUID');

    const path = `v4/trade/sales/shipping/${shippingUID}/close-shipping`;

    return this.http.post<Shipping>(path);
  }

}
