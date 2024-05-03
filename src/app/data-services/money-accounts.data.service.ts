/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { MoneyAccount, MoneyAccountsDataTable, MoneyAccountQuery } from '@app/models';


@Injectable()
export class MoneyAccountsDataService {

  constructor(private http: HttpService) { }


  getMoneyAccountTypes(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/financial/money-accounts/money-accounts-types';

    return this.http.get<Identifiable[]>(path);
  }


  getMoneyAccountStatus(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/financial/money-accounts/status';

    return this.http.get<Identifiable[]>(path);
  }


  searchMoneyAccounts(query: MoneyAccountQuery): EmpObservable<MoneyAccountsDataTable> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/trade/financial/money-accounts/search';

    return this.http.post<MoneyAccountsDataTable>(path, query);
  }


  getMoneyAccount(moneyAccountUID: string): EmpObservable<MoneyAccount> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}`;

    return this.http.get<MoneyAccount>(path);
  }

}