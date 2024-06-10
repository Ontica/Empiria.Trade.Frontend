/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MoneyAccountsDataService } from '@app/data-services';

import { EmptyMoneyAccount, MoneyAccount, MoneyAccountFields } from '@app/models';

import { MoneyAccountHeaderEventType } from './money-account-header.component';


export enum MoneyAccountEditorEventType {
  MONEY_ACCOUNT_UPDATED = 'MoneyAccountEditorComponent.Event.MoneyAccountUpdated',
  MONEY_ACCOUNT_DELETED = 'MoneyAccountEditorComponent.Event.MoneyAccountDeleted',
}

@Component({
  selector: 'emp-trade-money-account-editor',
  templateUrl: './money-account-editor.component.html',
})
export class MoneyAccountEditorComponent {

  @Input() moneyAccount: MoneyAccount = EmptyMoneyAccount;

  @Output() moneyAccountEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private moneyAccountsData: MoneyAccountsDataService) { }


  onMoneyAccountHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as MoneyAccountHeaderEventType) {
      case MoneyAccountHeaderEventType.UPDATE_MONEY_ACCOUNT:
        Assertion.assertValue(event.payload.moneyAccount, 'event.payload.moneyAccount');
        this.updateMoneyAccount(event.payload.moneyAccount as MoneyAccountFields);
        return;

      case MoneyAccountHeaderEventType.DELETE_MONEY_ACCOUNT:
        Assertion.assertValue(event.payload.moneyAccountUID, 'event.payload.moneyAccountUID');
        this.deleteMoneyAccount();
        return;

      case MoneyAccountHeaderEventType.SUSPEND_MONEY_ACCOUNT:
        Assertion.assertValue(event.payload.moneyAccountUID, 'event.payload.moneyAccountUID');
        this.suspendMoneyAccount();
        return;

      case MoneyAccountHeaderEventType.ACTIVATE_MONEY_ACCOUNT:
        Assertion.assertValue(event.payload.moneyAccountUID, 'event.payload.moneyAccountUID');
        this.activateMoneyAccount();
        return;

      case MoneyAccountHeaderEventType.PENDING_MONEY_ACCOUNT:
        Assertion.assertValue(event.payload.moneyAccountUID, 'event.payload.moneyAccountUID');
        this.pendingMoneyAccount();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateMoneyAccount(dataFields: MoneyAccountFields) {
    this.submitted = true;

    this.moneyAccountsData.updateMoneyAccount(this.moneyAccount.uid, dataFields)
      .firstValue()
      .then(x => this.resolveUpdateMoneyAccount(x))
      .finally(() => this.submitted = false);
  }


  private deleteMoneyAccount() {
    this.submitted = true;

    this.moneyAccountsData.deleteMoneyAccount(this.moneyAccount.uid)
      .firstValue()
      .then(x => this.resolveDeleteMoneyAccount(x))
      .finally(() => this.submitted = false);
  }


  private suspendMoneyAccount() {
    this.submitted = true;

    this.moneyAccountsData.suspendMoneyAccount(this.moneyAccount.uid)
      .firstValue()
      .then(x => this.resolveUpdateMoneyAccount(x))
      .finally(() => this.submitted = false);
  }


  private activateMoneyAccount() {
    this.submitted = true;

    this.moneyAccountsData.activateMoneyAccount(this.moneyAccount.uid)
      .firstValue()
      .then(x => this.resolveUpdateMoneyAccount(x))
      .finally(() => this.submitted = false);
  }


  private pendingMoneyAccount() {
    this.submitted = true;

    this.moneyAccountsData.pendingMoneyAccount(this.moneyAccount.uid)
      .firstValue()
      .then(x => this.resolveUpdateMoneyAccount(x))
      .finally(() => this.submitted = false);
  }


  private resolveUpdateMoneyAccount(moneyAccount: MoneyAccount) {
    sendEvent(this.moneyAccountEditorEvent,
      MoneyAccountEditorEventType.MONEY_ACCOUNT_UPDATED, { moneyAccount });
  }


  private resolveDeleteMoneyAccount(moneyAccount: MoneyAccount) {
    sendEvent(this.moneyAccountEditorEvent,
      MoneyAccountEditorEventType.MONEY_ACCOUNT_DELETED, { moneyAccount });
  }

}
