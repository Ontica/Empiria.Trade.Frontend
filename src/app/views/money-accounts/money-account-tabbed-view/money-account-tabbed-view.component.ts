/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyMoneyAccount, MoneyAccount } from '@app/models';

export enum MoneyAccountTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'MoneyAccountTabbedViewComponent.Event.CloseButtonClicked',
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


  private setTitle() {
    this.title = `${this.moneyAccount.moneyAccountNumber}` +
      `<span class="tag tag-small">${this.moneyAccount.status.name}</span>`;

    this.hint = `<strong>${this.moneyAccount.moneyAccountType.name} </strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; ${this.moneyAccount.moneyAccountOwner.name}`;
  }

}
