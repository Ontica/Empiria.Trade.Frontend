/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { MoneyAccountTransaction } from '@app/models';

import { MoneyAccountTransactionsEventType } from './money-account-transactions-table.component';

@Component({
  selector: 'emp-trade-money-account-transactions-edition',
  templateUrl: './money-account-transactions-edition.component.html',
})
export class MoneyAccountTransactionsEditionComponent {

  @Input() moneyAccountTransactions: MoneyAccountTransaction[] = [];

  @Input() canEdit = false;

  submitted = false;


  constructor(private messageBox: MessageBoxService) {

  }


  onAddTransactionClicked() {
    this.messageBox.showInDevelopment('Agregar transacción');
  }


  onMoneyAccountTransactionsEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as MoneyAccountTransactionsEventType) {

      case MoneyAccountTransactionsEventType.UPDATE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.transaction, 'event.payload.voucherEntry.transaction');
        this.messageBox.showInDevelopment('Actualizar transacción', event.payload.item);
        return;

      case MoneyAccountTransactionsEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.transaction, 'event.payload.transaction');
        this.messageBox.showInDevelopment('Eliminar transacción', event.payload.transaction);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
