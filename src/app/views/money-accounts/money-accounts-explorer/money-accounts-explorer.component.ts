/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyMoneyAccount, EmptyMoneyAccountDataTable, MoneyAccount,
         MoneyAccountsDataTable } from '@app/models';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import { MoneyAccountsFilterEventType } from './money-accounts-filter.component';

enum MoneyAccountsQueryType {
  All = 'all',
}

export enum MoneyAccountsExplorerEventType {
  CREATE_CLICKED = 'MoneyAccountsExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED = 'MoneyAccountsExplorerComponent.Event.SearchClicked',
  SELECT_CLICKED = 'MoneyAccountsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-trade-money-accounts-explorer',
  templateUrl: './money-accounts-explorer.component.html',
})
export class MoneyAccountsExplorerComponent implements OnChanges {

  @Input() queryType: MoneyAccountsQueryType = MoneyAccountsQueryType.All;

  @Input() data: MoneyAccountsDataTable = EmptyMoneyAccountDataTable;

  @Input() moneyAccountSelected: MoneyAccount = EmptyMoneyAccount;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() moneyAccountsExplorerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
    }
  }


  get titleText(): string {
    return 'cuentas y cajas';
  }


  get buttonText(): string {
    return 'cuenta o caja';
  }


  onCreateOrderClicked() {
    sendEvent(this.moneyAccountsExplorerEvent, MoneyAccountsExplorerEventType.CREATE_CLICKED);
  }


  onMoneyAccountsFilterEvent(event: EventInfo) {
    switch (event.type as MoneyAccountsFilterEventType) {
      case MoneyAccountsFilterEventType.SEARCH_CLICKED:
        sendEvent(this.moneyAccountsExplorerEvent, MoneyAccountsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        sendEvent(this.moneyAccountsExplorerEvent, MoneyAccountsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.data.entries.length} registros encontrados`;
  }

}
