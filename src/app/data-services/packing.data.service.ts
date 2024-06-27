/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { PackingOrderItemField, Packing, PackingItemFields, SaleOrder,
         InventoryOrderFields } from '@app/models';


@Injectable()
export class PackingDataService {

  constructor(private http: HttpService) { }


  getPackageType(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/sales/packing/package-types';

    return this.http.get<Identifiable[]>(path);
  }


  getOrderPacking(orderUID: string): EmpObservable<Packing> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v4/trade/sales/packing/${orderUID}`;

    return this.http.get<Packing>(path);
  }


  updateOrderPicking(orderUID: string,
                     dataFields: InventoryOrderFields): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/trade/sales/packing/${orderUID}/picking`;

    return this.http.put<SaleOrder>(path, dataFields);
  }


  createPackingItem(orderUID: string,
                    dataFields: PackingItemFields): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/trade/sales/packing/${orderUID}/packing-item`;

    return this.http.post<SaleOrder>(path, dataFields);
  }


  updatePackingItem(orderUID: string,
                    packingItemUID: string,
                    dataFields: PackingItemFields): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(packingItemUID, 'packingItemUID');
    Assertion.assertValue(dataFields, 'dataFields');


    const path = `v4/trade/sales/packing/${orderUID}/packing-item/${packingItemUID}`;

    return this.http.put<SaleOrder>(path, dataFields);
  }


  deletePackingItem(orderUID: string,
                    packingItemUID: string): EmpObservable<SaleOrder> {
    Assertion.assertValue(packingItemUID, 'packingItemUID');

    const path = `v4/trade/sales/packing/${orderUID}/packing-item/${packingItemUID}`;

    return this.http.delete<SaleOrder>(path);
  }


  createPackingItemEntry(orderUID: string,
                         packingItemUID: string,
                         entryFields: PackingOrderItemField): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(packingItemUID, 'packingItemUID');
    Assertion.assertValue(entryFields, 'entryFields');

    const path = `v4/trade/sales/packing/${orderUID}/packing-item/${packingItemUID}`;

    return this.http.post<SaleOrder>(path, entryFields);
  }


  removePackingItemEntry(orderUID: string,
                         packingItemUID: string,
                         packingItemEntryUID: string): EmpObservable<SaleOrder> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(packingItemUID, 'packingItemUID');
    Assertion.assertValue(packingItemEntryUID, 'packingItemEntryUID');

    const path = `v4/trade/sales/packing/${orderUID}/packing-item/` +
      `${packingItemUID}/${packingItemEntryUID}`;

    return this.http.delete<SaleOrder>(path);
  }

}
