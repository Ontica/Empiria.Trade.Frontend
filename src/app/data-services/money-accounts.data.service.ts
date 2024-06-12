/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { MoneyAccount, MoneyAccountsDataTable, MoneyAccountQuery, MoneyAccountFields, MoneyAccountTransaction,
         MoneyAccountTransactionFields, MoneyAccountTransactionItemFields } from '@app/models';


@Injectable()
export class MoneyAccountsDataService {

  constructor(private http: HttpService) { }


  //#region Catalogs

  getMoneyAccountTypes(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/financial/money-accounts/money-accounts-types';

    return this.http.get<Identifiable[]>(path);
  }


  getMoneyAccountStatus(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/financial/money-accounts/status';

    return this.http.get<Identifiable[]>(path);
  }


  getMoneyAccountTransactionTypes(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/financial/money-accounts/transactions/transaction-types';

    return this.http.get<Identifiable[]>(path);
  }


  getMoneyAccountPaymentTypes(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/financial/money-accounts/payment-types';

    return this.http.get<Identifiable[]>(path);
  }


  getMoneyAccountTransactionItemTypes(): EmpObservable<Identifiable[]> {
    const path = 'v4/trade/financial/money-accounts/transactions/items-types';

    return this.http.get<Identifiable[]>(path);
  }

  //#endregion


  //#region MoneyAccount

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


  createMoneyAccount(moneyAccountFields: MoneyAccountFields): EmpObservable<MoneyAccount> {
    Assertion.assertValue(moneyAccountFields, 'moneyAccountFields');

    const path = 'v4/trade/financial/money-accounts';

    return this.http.post<MoneyAccount>(path, moneyAccountFields);
  }


  updateMoneyAccount(moneyAccountUID: string,
                     moneyAccountFields: MoneyAccountFields): EmpObservable<MoneyAccount> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');
    Assertion.assertValue(moneyAccountFields, 'moneyAccountFields');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}`;

    return this.http.put<MoneyAccount>(path, moneyAccountFields);
  }


  deleteMoneyAccount(moneyAccountUID: string): EmpObservable<MoneyAccount> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/cancel`;

    return this.http.delete<MoneyAccount>(path);
  }


  suspendMoneyAccount(moneyAccountUID: string): EmpObservable<MoneyAccount> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/suspend`;

    return this.http.post<MoneyAccount>(path);
  }


  activateMoneyAccount(moneyAccountUID: string): EmpObservable<MoneyAccount> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/active`;

    return this.http.post<MoneyAccount>(path);
  }


  pendingMoneyAccount(moneyAccountUID: string): EmpObservable<MoneyAccount> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/pending`;

    return this.http.post<MoneyAccount>(path);
  }

  //#endregion


  //#region MoneyAccountTransactions

  getMoneyAccountTransaction(moneyAccountUID: string,
                             transactionUID: string): EmpObservable<MoneyAccountTransaction> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/transactions/${transactionUID}`;

    return this.http.get<MoneyAccountTransaction>(path);
  }


  createMoneyAccountTransaction(moneyAccountUID: string,
                                transactionFields: MoneyAccountTransactionFields): EmpObservable<MoneyAccountTransaction> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');
    Assertion.assertValue(transactionFields, 'transactionFields');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/transactions/`;

    return this.http.post<MoneyAccountTransaction>(path, transactionFields);
  }


  updateMoneyAccountTransaction(moneyAccountUID: string,
                                transactionUID: string,
                                transactionFields: MoneyAccountTransactionFields): EmpObservable<MoneyAccountTransaction> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(transactionFields, 'transactionFields');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/transactions/${transactionUID}`;

    return this.http.put<MoneyAccountTransaction>(path, transactionFields);
  }


  deleteMoneyAccountTransaction(moneyAccountUID: string,
                                transactionUID: string): EmpObservable<MoneyAccountTransaction> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/transactions/${transactionUID}/cancel`;

    return this.http.delete<MoneyAccountTransaction>(path);
  }

  //#endregion


  //#region MoneyAccountTransactionItems

  createMoneyAccountTransactionItem(moneyAccountUID: string,
                                    transactionUID: string,
                                    itemFields: MoneyAccountTransactionItemFields): EmpObservable<MoneyAccountTransaction> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(itemFields, 'itemFields');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/transactions/${transactionUID}/items`;

    return this.http.post<MoneyAccountTransaction>(path, itemFields);
  }


  updateMoneyAccountTransactionItem(moneyAccountUID: string, transactionUID: string, itemUID: string,
                                    itemFields: MoneyAccountTransactionItemFields): EmpObservable<MoneyAccountTransaction> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(itemUID, 'itemUID');
    Assertion.assertValue(itemFields, 'itemFields');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/` +
      `transactions/${transactionUID}/items/${itemUID}`;

    return this.http.put<MoneyAccountTransaction>(path, itemFields);
  }


  deleteMoneyAccountTransactionItem(moneyAccountUID: string,
                                    transactionUID: string,
                                    itemUID: string,): EmpObservable<MoneyAccountTransaction> {
    Assertion.assertValue(moneyAccountUID, 'moneyAccountUID');
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(itemUID, 'itemUID');

    const path = `v4/trade/financial/money-accounts/${moneyAccountUID}/` +
      `transactions/${transactionUID}/items/${itemUID}/cancel`;

    return this.http.delete<MoneyAccountTransaction>(path);
  }

  //#endregion

}
