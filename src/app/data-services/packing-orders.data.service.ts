/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { PackingOrderItemField, Packing, PackingItemFields } from '@app/models';


@Injectable()
export class PackingOrdersDataService {

  constructor(private http: HttpService) { }


  getPackageType(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/shipping-and-handling/packing/package-types';

    return this.http.get<Identifiable[]>(path);
  }


  getOrderPacking(orderUID: string): EmpObservable<Packing> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/shipping-and-handling/packing/${orderUID}`;

    return this.http.get<Packing>(path);
  }


  createPackingItem(orderUID: string,
                    packingItemFields: PackingItemFields): EmpObservable<Packing> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(packingItemFields, 'packingItemFields');

    const path = `v4/trade/shipping-and-handling/packing/${orderUID}/packing-item`;

    return this.http.post<Packing>(path, packingItemFields);
  }


  updatePackingItem(orderUID: string,
                    packingItemUID: string,
                    packingItemFields: PackingItemFields): EmpObservable<Packing> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(packingItemUID, 'packingItemUID');
    Assertion.assertValue(packingItemFields, 'packingItemFields');


    const path = `v4/trade/shipping-and-handling/packing/${orderUID}/packing-item/${packingItemUID}`;

    return this.http.put<Packing>(path, packingItemFields);
  }


  deletePackingItem(orderUID: string,
                    packingItemUID: string): EmpObservable<Packing> {
    Assertion.assertValue(packingItemUID, 'packingItemUID');

    const path = `v4/trade/shipping-and-handling/packing/${orderUID}/packing-item/${packingItemUID}`;

    return this.http.delete<Packing>(path);
  }


  createPackingItemEntry(orderUID: string,
                         packingItemUID: string,
                         entryFields: PackingOrderItemField): EmpObservable<Packing> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(packingItemUID, 'packingItemUID');
    Assertion.assertValue(entryFields, 'entryFields');

    const path = `v4/trade/shipping-and-handling/packing/${orderUID}/packing-item/${packingItemUID}`;

    return this.http.post<Packing>(path, entryFields);
  }


  removePackingItemEntry(orderUID: string,
                         packingItemUID: string,
                         packingItemEntryUID: string): EmpObservable<Packing> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(packingItemUID, 'packingItemUID');
    Assertion.assertValue(packingItemEntryUID, 'packingItemEntryUID');

    const path = `v4/trade/shipping-and-handling/packing/${orderUID}/packing-item/` +
      `${packingItemUID}/${packingItemEntryUID}`;

    return this.http.delete<Packing>(path);
  }

}
