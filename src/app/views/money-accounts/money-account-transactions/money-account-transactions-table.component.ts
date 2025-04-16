/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { EmptyMoneyAccountTransactionsDataTable, MoneyAccountTransactionDescriptor,
         MoneyAccountTransactionsDataTable } from '@app/models';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum MoneyAccountTransactionsEventType {
  SELECT_ITEM_CLICKED = 'MoneyAccountTransactionsTableComponent.Event.SelectItemClicked',
  REMOVE_ITEM_CLICKED = 'MoneyAccountTransactionsTableComponent.Event.RemoveItemClicked',
}

@Component({
  selector: 'emp-trade-money-account-transactions-table',
  templateUrl: './money-account-transactions-table.component.html',
})
export class MoneyAccountTransactionsTableComponent implements OnChanges {

  @Input() transactions: MoneyAccountTransactionDescriptor[] = [];

  @Input() canEdit = false;

  @Output() moneyAccountTransactionsEvent = new EventEmitter<EventInfo>();

  moneyAccountTransactionsData: MoneyAccountTransactionsDataTable = EmptyMoneyAccountTransactionsDataTable;

  isLoading = true;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactions) {
      this.moneyAccountTransactionsData =
        Object.assign({}, EmptyMoneyAccountTransactionsDataTable, { entries: this.transactions });
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.ENTRY_CLICKED:
        sendEvent(this.moneyAccountTransactionsEvent, MoneyAccountTransactionsEventType.SELECT_ITEM_CLICKED,
          { transaction: event.payload.entry });
        return;


      case DataTableEventType.DELETE_ENTRY_CLICKED:
        this.confirmDeleteTransaction(event.payload.entry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private confirmDeleteTransaction(transaction: MoneyAccountTransactionDescriptor) {
    const message = this.getConfirmDeleteMessage(transaction);

    this.messageBox.confirm(message, 'Eliminar movimiento', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.moneyAccountTransactionsEvent, MoneyAccountTransactionsEventType.REMOVE_ITEM_CLICKED,
            { transactionUID: transaction.uid });
        }
      });
  }


  private getConfirmDeleteMessage(transaction: MoneyAccountTransactionDescriptor): string {
    const transactionDate = DateStringLibrary.format(transaction.transactionDate);

    return `
      <table class="confirm-data">
        <tr><td class="nowrap">Tipo de operación: </td><td><strong>
          ${transaction.transactionTypeName}
        </strong></td></tr>

        <tr><td>Número: </td><td><strong>
          ${transaction.transactionNumber}
        </strong></td></tr>

        <tr><td class='nowrap'>Fecha: </td><td><strong>
          ${transactionDate}
        </strong></td></tr>
      </table>

     <br>¿Elimino la transacción?`;
  }

}
