/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { Customer } from '@app/models';


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


  getCustomersWithContacts(keywords: string): EmpObservable<Customer[]> {
    Assertion.assertValue(keywords, 'keywords');

    const path = `v4/trade/contacts/customers-with-contacts/?keywords=${keywords}`;

    return this.http.get<Customer[]>(path);
  }


  getAccountHolders(keywords: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(keywords, 'keywords');

    const path = `v4/trade/contacts/account-holders/?keywords=${keywords}`;

    return this.http.get<Identifiable[]>(path);
  }

}
