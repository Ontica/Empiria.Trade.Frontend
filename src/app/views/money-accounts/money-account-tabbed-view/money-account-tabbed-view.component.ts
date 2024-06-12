/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyMoneyAccount, MoneyAccount } from '@app/models';

import { MoneyAccountEditorEventType } from '../money-account/money-account-editor.component';

import {
  MoneyAccountTransactionsEditionEventType
} from '../money-account-transactions/money-account-transactions-edition.component';

export enum MoneyAccountTabbedViewEventType {
  CLOSE_BUTTON_CLICKED  = 'MoneyAccountTabbedViewComponent.Event.CloseButtonClicked',
  MONEY_ACCOUNT_UPDATED = 'MoneyAccountTabbedViewComponent.Event.MoneyAccountUpdated',
  MONEY_ACCOUNT_DELETED = 'MoneyAccountTabbedViewComponent.Event.MoneyAccountDeleted',
  TRANSACTIONS_UPDATED  = 'MoneyAccountTabbedViewComponent.Event.TransactionsUpdated',
}

@Component({
  selector: 'emp-trade-money-account-tabbed-view',
  templateUrl: './money-account-tabbed-view.component.html',
})
export class MoneyAccountTabbedViewComponent implements OnChanges {

  @Input() moneyAccount: MoneyAccount = EmptyMoneyAccount;

  @Output() moneyAccountTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onClose() {
    sendEvent(this.moneyAccountTabbedViewEvent, MoneyAccountTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onMoneyAccountEditorEvent(event: EventInfo) {
    switch (event.type as MoneyAccountEditorEventType) {
      case MoneyAccountEditorEventType.MONEY_ACCOUNT_UPDATED:
        Assertion.assertValue(event.payload.moneyAccount, 'event.payload.moneyAccount');
        sendEvent(this.moneyAccountTabbedViewEvent,
          MoneyAccountTabbedViewEventType.MONEY_ACCOUNT_UPDATED, event.payload);
        return;

      case MoneyAccountEditorEventType.MONEY_ACCOUNT_DELETED:
        Assertion.assertValue(event.payload.moneyAccount, 'event.payload.moneyAccount');
        sendEvent(this.moneyAccountTabbedViewEvent,
          MoneyAccountTabbedViewEventType.MONEY_ACCOUNT_DELETED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onMoneyAccountTransactionsEditionEvent(event: EventInfo) {
    switch (event.type as MoneyAccountTransactionsEditionEventType) {
      case MoneyAccountTransactionsEditionEventType.TRANSACTIONS_UPDATED:
        Assertion.assertValue(event.payload.moneyAccountUID, 'event.payload.moneyAccountUID');
        sendEvent(this.moneyAccountTabbedViewEvent,
          MoneyAccountTabbedViewEventType.TRANSACTIONS_UPDATED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    this.title = `${this.moneyAccount.moneyAccountNumber}` +
      `<span class="tag tag-small">${this.moneyAccount.status.name}</span>`;

    this.hint = `<strong>${this.moneyAccount.moneyAccountType.name} </strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; ${this.moneyAccount.moneyAccountOwner.name}`;
  }

}
