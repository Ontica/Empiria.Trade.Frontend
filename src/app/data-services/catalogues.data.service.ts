/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable, HttpService, Identifiable } from '@app/core';


@Injectable()
export class CataloguesDataService {


  constructor(private http: HttpService) { }


  getCurrencies(): EmpObservable<Identifiable[]> {
    const path = `v8/financial/currencies`;

    return this.http.get<Identifiable[]>(path);
  }

}
