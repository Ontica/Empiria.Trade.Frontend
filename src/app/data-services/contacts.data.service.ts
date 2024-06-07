/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable, HttpService, Identifiable } from '@app/core';


@Injectable()
export class ContactsDataService {

  constructor(private http: HttpService) { }


  getInternalSuppliers(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/contacts/internal-suppliers';

    return this.http.get<Identifiable[]>(path);
  }


  getSalesAgents(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/contacts/sales-agents';

    return this.http.get<Identifiable[]>(path);
  }


  getWarehousemen(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/contacts/warehousemen';

    return this.http.get<Identifiable[]>(path);
  }

}
