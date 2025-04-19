/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { OrderItemEntry } from '@app/models';


export enum InventoryOrderItemEntriesTableEventType {
  REMOVE_ENTRY_CLICKED = 'InventoryOrderItemEntriesTableComponent.Event.RemoveEntryClicked',
}

@Component({
  selector: 'emp-trade-inventory-order-item-entries-table',
  templateUrl: './inventory-order-item-entries-table.component.html',
})
export class InventoryOrderItemEntriesTableComponent implements OnChanges {

  @Input() orderUID = '';

  @Input() itemUID = '';

  @Input() entries: OrderItemEntry[] = [];

  @Input() assignedQuantity = 0;

  @Input() canEdit = false;

  @Output() inventoryOrderItemEntriesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['product', 'location', 'quantity'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<OrderItemEntry>;


  constructor(private messageBox: MessageBoxService) { }


  get hasEntries(): boolean {
    return this.entries.length > 0;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entries) {
      this.setDataTable();
    }

    if (changes.canEdit) {
      this.resetColumns();
    }
  }


  onRemoveEntryClicked(entry: OrderItemEntry) {
    const message = this.getConfirmDeleteMessage(entry);

    this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.inventoryOrderItemEntriesTableEvent,
          InventoryOrderItemEntriesTableEventType.REMOVE_ENTRY_CLICKED,
          { orderUID: this.orderUID, itemUID: this.itemUID, entryUID: entry.uid })
       );
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.entries ?? []);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmDeleteMessage(entry: OrderItemEntry): string {
    return `
      <table class="confirm-data">
        <tr><td class="nowrap">Producto: </td><td><strong>
          ${entry.product}
        </strong></td></tr>

        <tr><td>Localización: </td><td><strong>
          ${entry.location}
        </strong></td></tr>

        <tr><td>Cantidad: </td><td><strong>
          ${entry.quantity}
        </strong></td></tr>
      </table>

     <br>¿Elimino el registro?`;
  }

}
