/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable, HttpService } from '@app/core';

import { WarehouseBinForInventory } from '@app/models';


@Injectable()
export class WarehouseDataService {

  constructor(private http: HttpService) { }


  getWarehouseBinsForInventory(): EmpObservable<WarehouseBinForInventory[]> {
    const path = 'v4/trade/warehouse-bin/for-inventory';

    return this.http.get<WarehouseBinForInventory[]>(path);
  }

}
