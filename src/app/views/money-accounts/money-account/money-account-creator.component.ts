/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MoneyAccountsDataService } from '@app/data-services';

import { MoneyAccount, MoneyAccountFields } from '@app/models';

import { MoneyAccountHeaderEventType } from './money-account-header.component';

export enum MoneyAccountCreatorEventType {
  CLOSE_MODAL_CLICKED   = 'MoneyAccountCreatorComponent.Event.CloseModalClicked',
  MONEY_ACCOUNT_CREATED = 'MoneyAccountCreatorComponent.Event.MoneyAccountCreated',
}

@Component({
  selector: 'emp-trade-money-account-creator',
  templateUrl: './money-account-creator.component.html',
})
export class MoneyAccountCreatorComponent {

  @Output() moneyAccountCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private moneyAccountsData: MoneyAccountsDataService) { }


  onCloseModalClicked() {
    sendEvent(this.moneyAccountCreatorEvent, MoneyAccountCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onMoneyAccountHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as MoneyAccountHeaderEventType) {
      case MoneyAccountHeaderEventType.CREATE_MONEY_ACCOUNT:
        Assertion.assertValue(event.payload.moneyAccount, 'event.payload.moneyAccount');
        this.createMoneyAccount(event.payload.moneyAccount as MoneyAccountFields)
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createMoneyAccount(dataFields: MoneyAccountFields) {
    this.submitted = true;

    this.moneyAccountsData.createMoneyAccount(dataFields)
      .firstValue()
      .then(x => this.resolveCreateMoneyAccount(x))
      .finally(() => this.submitted = false);
  }


  private resolveCreateMoneyAccount(moneyAccount: MoneyAccount) {
    sendEvent(this.moneyAccountCreatorEvent, MoneyAccountCreatorEventType.MONEY_ACCOUNT_CREATED,
      { moneyAccount });
  }

}
