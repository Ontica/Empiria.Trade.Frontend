/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { MoneyAccountTransactionItem } from '@app/models';


export enum MoneyAccountTransactionItemsEventType {
  SELECT_ITEM_CLICKED = 'MoneyAccountTransactionItemsTableComponent.Event.SelectItemClicked',
  REMOVE_ITEM_CLICKED = 'MoneyAccountTransactionItemsTableComponent.Event.RemoveItemClicked',
}

@Component({
  selector: 'emp-trade-money-account-transaction-items-table',
  templateUrl: './money-account-transaction-items-table.component.html',
})
export class MoneyAccountTransactionItemsTableComponent implements OnChanges {

  @Input() transactionUID = '';

  @Input() transactionItems: MoneyAccountTransactionItem[] = [];

  @Input() canEdit = false;

  @Output() moneyAccountTransactionItemsEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['itemType', 'paymentType', 'reference', 'notes', 'postedTime',
                                       'deposit', 'withdrawal'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<MoneyAccountTransactionItem>;


  constructor(private messageBox: MessageBoxService) { }


  get hasOrderItems(): boolean {
    return this.transactionItems.length > 0;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionItems) {
      this.setDataTable();
    }

    if (changes.canEdit) {
      this.resetColumns();
    }
  }


  onDeleteItemClicked(transactionItem: MoneyAccountTransactionItem) {
    const message = this.getConfirmDeleteMessage(transactionItem);

    this.messageBox.confirm(message, 'Eliminar movimiento', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.moneyAccountTransactionItemsEvent,
            MoneyAccountTransactionItemsEventType.REMOVE_ITEM_CLICKED,
            { transactionUID: this.transactionUID, transactionItemUID: transactionItem.uid });
        }
      });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.transactionItems ?? []);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmDeleteMessage(transactionItem: MoneyAccountTransactionItem): string {
    return `
      <table class="confirm-data">
        <tr><td class="nowrap">Tipo de movimiento: </td><td><strong>
          ${transactionItem.itemType.name}
        </strong></td></tr>

        <tr><td>Forma de pago: </td><td><strong>
          ${transactionItem.paymentType.name}
        </strong></td></tr>
      </table>

     <br>¿Elimino el movimiento?`;
  }


}
