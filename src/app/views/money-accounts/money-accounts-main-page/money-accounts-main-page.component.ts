/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MoneyAccountsDataService } from '@app/data-services';

import { EmptyMoneyAccount, EmptyMoneyAccountDataTable, EmptyMoneyAccountQuery, MoneyAccount,
         MoneyAccountsDataTable, MoneyAccountQuery, buildMoneyAccountActions } from '@app/models';

import {
  MoneyAccountsExplorerEventType
} from '../money-accounts-explorer/money-accounts-explorer.component';

import {
  MoneyAccountTabbedViewEventType
} from '../money-account-tabbed-view/money-account-tabbed-view.component';

import {
  MoneyAccountCreatorEventType
} from '../money-account/money-account-creator.component';

@Component({
  selector: 'emp-trade-money-accounts-main-page',
  templateUrl: './money-accounts-main-page.component.html',
})
export class MoneyAccountsMainPageComponent {

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  query: MoneyAccountQuery = EmptyMoneyAccountQuery;

  data: MoneyAccountsDataTable = Object.assign({}, EmptyMoneyAccountDataTable);

  moneyAccountSelected: MoneyAccount = EmptyMoneyAccount;

  displayTabbedView = false;

  displayCreator = false;


  constructor(private moneyAccountsData: MoneyAccountsDataService) { }


  onMoneyAccountCreatorEvent(event: EventInfo) {
    switch (event.type as MoneyAccountCreatorEventType) {
      case MoneyAccountCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;

      case MoneyAccountCreatorEventType.MONEY_ACCOUNT_CREATED:
        Assertion.assertValue(event.payload.moneyAccount, 'event.payload.moneyAccount');
        this.displayCreator = false;
        this.setMoneyAccountSelected(event.payload.moneyAccount as MoneyAccount);
        this.validateQueryForRefreshMoneyAccounts(this.moneyAccountSelected.moneyAccountType.uid,
          this.moneyAccountSelected.moneyAccountNumber);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onMoneyAccountsExplorerEvent(event: EventInfo) {
    switch (event.type as MoneyAccountsExplorerEventType) {
      case MoneyAccountsExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        return;

      case MoneyAccountsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as MoneyAccountQuery;
        this.clearMoneyAccountsData();
        this.clearMoneyAccountSelected();
        this.searchMoneyAccounts(this.query);
        return;

      case MoneyAccountsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.getMoneyAccount(event.payload.entry.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onMoneyAccountTabbedViewEvent(event: EventInfo) {
    switch (event.type as MoneyAccountTabbedViewEventType) {
      case MoneyAccountTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.clearMoneyAccountSelected();
        return;

      case MoneyAccountTabbedViewEventType.MONEY_ACCOUNT_UPDATED:
        Assertion.assertValue(event.payload.moneyAccount, 'event.payload.moneyAccount');
        this.refreshMoneyAccounts();
        this.setMoneyAccountSelected(event.payload.moneyAccount as MoneyAccount);
        return;

      case MoneyAccountTabbedViewEventType.MONEY_ACCOUNT_DELETED:
        Assertion.assertValue(event.payload.moneyAccount, 'event.payload.moneyAccount');
        this.refreshMoneyAccounts();
        this.clearMoneyAccountSelected();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateQueryForRefreshMoneyAccounts(moneyAccountTypeUID: string, keywords: string) {
    if (this.query.moneyAccountTypeUID !== moneyAccountTypeUID) {
      const newQuery: MoneyAccountQuery = {
        moneyAccountTypeUID,
        keywords,
        status: ''
      };

      this.query = Object.assign({}, this.query, newQuery);
    }

    this.refreshMoneyAccounts();
  }


  private refreshMoneyAccounts() {
    this.searchMoneyAccounts(this.query);
  }


  private searchMoneyAccounts(query: MoneyAccountQuery) {
    this.isLoading = true;

    this.moneyAccountsData.searchMoneyAccounts(query)
      .firstValue()
      .then(x => this.resolveSearchMoneyAccounts(x))
      .finally(() => this.isLoading = false);
  }


  private getMoneyAccount(moneyAccountUID: string) {
    this.isLoadingSelection = true;

    this.moneyAccountsData.getMoneyAccount(moneyAccountUID)
      .firstValue()
      .then(x => this.setMoneyAccountSelected(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveSearchMoneyAccounts(data: MoneyAccountsDataTable) {
    this.setMoneyAccountsData(data, true);
  }


  private setMoneyAccountsData(data: MoneyAccountsDataTable, queryExecuted: boolean = true) {
    this.data = data;
    this.queryExecuted = queryExecuted;
  }


  private clearMoneyAccountsData() {
    this.setMoneyAccountsData(EmptyMoneyAccountDataTable, false);
  }


  private setMoneyAccountSelected(data: MoneyAccount) {
    // START-TMP
    buildMoneyAccountActions(data);
    // END-TMP

    this.moneyAccountSelected = data;
    this.displayTabbedView = !isEmpty(this.moneyAccountSelected);
  }


  private clearMoneyAccountSelected() {
    this.setMoneyAccountSelected(EmptyMoneyAccount);
  }

}
