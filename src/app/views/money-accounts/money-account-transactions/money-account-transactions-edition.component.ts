/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MoneyAccountsDataService } from '@app/data-services';

import { MoneyAccountTransaction, MoneyAccountTransactionDescriptor,MoneyAccountTransactionFields,
         MoneyAccountTransactionItemFields } from '@app/models';

import { MoneyAccountTransactionsEventType } from './money-account-transactions-table.component';

import {
  MoneyAccountTransactionEditorEventType
} from '../money-account-transaction/money-account-transaction-editor.component';


export enum MoneyAccountTransactionsEditionEventType {
  TRANSACTIONS_UPDATED = 'MoneyAccountTransactionsEditionComponent.Event.TransactionsUpdated',
}


@Component({
  selector: 'emp-trade-money-account-transactions-edition',
  templateUrl: './money-account-transactions-edition.component.html',
})
export class MoneyAccountTransactionsEditionComponent {

  @Input() moneyAccountUID = '';

  @Input() transactions: MoneyAccountTransactionDescriptor[] = [];

  @Input() canEdit = false;

  @Output() moneyAccountTransactionsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  isLoading = false;

  displayTransaction = false;

  selectedTransaction: MoneyAccountTransaction = null;


  constructor(private moneyAccountsData: MoneyAccountsDataService) { }


  onAddTransactionClicked() {
    this.setSelectedTransaction(null, true);
  }


  onMoneyAccountTransactionsEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as MoneyAccountTransactionsEventType) {

      case MoneyAccountTransactionsEventType.SELECT_ITEM_CLICKED:
        Assertion.assertValue(event.payload.transaction, 'event.payload.voucherEntry.transaction');
        this.getMoneyAccountTransaction(event.payload.transaction.uid)

        return;

      case MoneyAccountTransactionsEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        this.deleteMoneyAccountTransaction(event.payload.transactionUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onMoneyAccountTransactionEditorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as MoneyAccountTransactionEditorEventType) {

      case MoneyAccountTransactionEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedTransaction(null, false);
        return;

      case MoneyAccountTransactionEditorEventType.CREATE_TRANSACTION:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createMoneyAccountTransaction(event.payload.dataFields as MoneyAccountTransactionFields);
        return;

      case MoneyAccountTransactionEditorEventType.UPDATE_TRANSACTION:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateMoneyAccountTransaction(event.payload.transactionUID,
                                           event.payload.dataFields as MoneyAccountTransactionFields);
        return;

      case MoneyAccountTransactionEditorEventType.CREATE_TRANSACTION_ITEM:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createMoneyAccountTransactionItem(event.payload.transactionUID,
          event.payload.dataFields as MoneyAccountTransactionItemFields);
        return;

      case MoneyAccountTransactionEditorEventType.REMOVE_TRANSACTION_ITEM:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.transactionItemUID, 'event.payload.transactionItemUID');
        this.deleteMoneyAccountTransactionItem(event.payload.transactionUID,
          event.payload.transactionItemUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getMoneyAccountTransaction(transactionUID: string) {
    this.isLoading = true;

    this.moneyAccountsData.getMoneyAccountTransaction(this.moneyAccountUID, transactionUID)
      .firstValue()
      .then(x => this.setSelectedTransaction(x, true))
      .finally(() => this.isLoading = false);
  }


  private createMoneyAccountTransaction(transactionFields: MoneyAccountTransactionFields) {
    this.submitted = true;

    this.moneyAccountsData.createMoneyAccountTransaction(this.moneyAccountUID, transactionFields)
      .firstValue()
      .then(x => this.resolveMoneyAccountTransactionsUpdated(x))
      .finally(() => this.submitted = false);
  }


  private updateMoneyAccountTransaction(transactionUID: string,
                                        transactionFields: MoneyAccountTransactionFields) {
    this.submitted = true;

    this.moneyAccountsData.updateMoneyAccountTransaction(this.moneyAccountUID, transactionUID, transactionFields)
      .firstValue()
      .then(x => this.resolveMoneyAccountTransactionsUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteMoneyAccountTransaction(transactionUID: string) {
    this.submitted = true;

    this.moneyAccountsData.deleteMoneyAccountTransaction(this.moneyAccountUID, transactionUID)
      .firstValue()
      .then(x => this.resolveMoneyAccountTransactionsUpdated(null))
      .finally(() => this.submitted = false);
  }


  private createMoneyAccountTransactionItem(transactionUID: string,
                                            itemFields: MoneyAccountTransactionItemFields) {
    this.submitted = true;

    this.moneyAccountsData.createMoneyAccountTransactionItem(this.moneyAccountUID, transactionUID, itemFields)
      .firstValue()
      .then(x => this.resolveMoneyAccountTransactionsUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteMoneyAccountTransactionItem(transactionUID: string,
                                            itemUID: string) {
    this.submitted = true;

    this.moneyAccountsData.deleteMoneyAccountTransactionItem(this.moneyAccountUID, transactionUID, itemUID)
      .firstValue()
      .then(x => this.resolveMoneyAccountTransactionsUpdated(x))
      .finally(() => this.submitted = false);
  }


  private setSelectedTransaction(transaction: MoneyAccountTransaction, display: boolean) {
    this.selectedTransaction = transaction;
    this.displayTransaction = display;
  }


  private resolveMoneyAccountTransactionsUpdated(transaction: MoneyAccountTransaction) {
    this.setSelectedTransaction(transaction, isEmpty(transaction) ? false : true);

    sendEvent(this.moneyAccountTransactionsEditionEvent,
      MoneyAccountTransactionsEditionEventType.TRANSACTIONS_UPDATED,
      { moneyAccountUID: this.moneyAccountUID });
  }

}
