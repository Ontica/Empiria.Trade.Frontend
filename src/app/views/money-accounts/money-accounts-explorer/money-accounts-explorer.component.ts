/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { MoneyAccountsDataService } from '@app/data-services';

import { EmptyMoneyAccountDataTable, MoneyAccountDataTable, MoneyAccountQuery } from '@app/models';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import { MoneyAccountsFilterEventType } from './money-accounts-filter.component';


enum MoneyAccountsQueryType {
  All = 'all',
}


@Component({
  selector: 'emp-trade-money-accounts-explorer',
  templateUrl: './money-accounts-explorer.component.html',
})
export class MoneyAccountsExplorerComponent implements OnInit {

  queryType: MoneyAccountsQueryType = MoneyAccountsQueryType.All;

  cardHint = 'Seleccionar los filtros';

  data: MoneyAccountDataTable = Object.assign({}, EmptyMoneyAccountDataTable);

  isLoading = false;

  queryExecuted = false;


  constructor(private moneyAccountsData: MoneyAccountsDataService,
              private messageBox: MessageBoxService) {

  }


  ngOnInit() {
    this.setText();
  }

  get titleText(): string {
    return 'cuentas y cajas';
  }


  get buttonText(): string {
    return 'cuenta o caja';
  }


  onCreateOrderClicked() {
    this.messageBox.showInDevelopment(`Agregar ${this.buttonText}`);
  }


  onMoneyAccountsFilterEvent(event: EventInfo) {
    switch (event.type as MoneyAccountsFilterEventType) {
      case MoneyAccountsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setMoneyAccountsData(EmptyMoneyAccountDataTable, false);
        this.searchMoneyAccounts(event.payload.query as MoneyAccountQuery);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');

        this.messageBox.showInDevelopment(`Detalle de ${this.buttonText}`, event.payload.entry);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchMoneyAccounts(query: MoneyAccountQuery) {
    this.isLoading = true;

    this.moneyAccountsData.searchMoneyAccounts(query)
      .firstValue()
      .then(x => this.resolveSearchMoneyAccounts(x, true))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchMoneyAccounts(data: MoneyAccountDataTable, queryExecuted: boolean) {
    this.setMoneyAccountsData(data, queryExecuted);
  }


  private setMoneyAccountsData(data: MoneyAccountDataTable, queryExecuted: boolean = true) {
    this.data = data;
    this.queryExecuted = queryExecuted;

    this.setText();
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.data.entries.length} registros encontrados`;
  }

}
