/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { InventoryOrderItem, OrderItem } from '@app/models';

export enum InventoryOrderItemsTableEventType {
  SELECT_ITEM_CLICKED       = 'InventoryOrderItemsTableComponent.Event.SelectItemClicked',
  REMOVE_ITEM_CLICKED       = 'InventoryOrderItemsTableComponent.Event.RemoveItemClicked',
  EDIT_ITEM_ENTRIES_CLICKED = 'InventoryOrderItemsTableComponent.Event.EditItemEntriesClicked',
}

@Component({
  selector: 'emp-trade-inventory-order-items-table',
  templateUrl: './inventory-order-items-table.component.html',
})
export class InventoryOrderItemsTableComponent implements OnChanges {

  @Input() orderUID: string = null;

  @Input() items: InventoryOrderItem[] = [];

  @Input() canDelete = false;

  @Input() canEditEntries = false;

  @Input() itemsRequired = false;

  @Input() entriesRequired = false;

  @Output() inventoryOrderItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['number', 'product', 'quantity'];

  dataSource: MatTableDataSource<InventoryOrderItem>;


  constructor(private messageBox: MessageBoxService) { }


  get hasItems(): boolean {
    return this.items.length > 0;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.setDataTable();
    }
  }


  onSelectItemClicked(item: InventoryOrderItem) {
    sendEvent(this.inventoryOrderItemsTableEvent, InventoryOrderItemsTableEventType.SELECT_ITEM_CLICKED,
      { item });
  }


  onDeleteItemClicked(item: InventoryOrderItem) {
    const message = this.getConfirmDeleteMessage(item);

    this.messageBox.confirm(message, 'Eliminar movimiento', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.inventoryOrderItemsTableEvent,
          InventoryOrderItemsTableEventType.REMOVE_ITEM_CLICKED, {orderUID: this.orderUID, itemUID: item.uid})
      );
  }


  onEditItemEntriesClicked(item: InventoryOrderItem) {
    sendEvent(this.inventoryOrderItemsTableEvent, InventoryOrderItemsTableEventType.EDIT_ITEM_ENTRIES_CLICKED,
      { item })  ;
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.items ?? []);
    this.resetColumns();
  }


  private resetColumns() {
    const columns = this.itemsRequired ?
      ['number', 'product', 'location', 'quantity'] :
      ['number', 'product', 'quantity'];

    if (this.entriesRequired) columns.push('assignedQuantity');
    if (this.entriesRequired || this.canDelete) columns.push('action');

    this.displayedColumns = [...columns];
  }


  private getConfirmDeleteMessage(item: OrderItem): string {
    return `Esta operación eliminará el movimiento:<br><br>
      <table class="confirm-data">
        <tr><td>Producto: </td><td><strong> ${item.productName} </strong></td></tr>
        <tr><td>Cantidad: </td><td><strong> ${item.quantity} </strong></td></tr>
      </table>
     <br>¿Elimino el movimiento?`;
  }

}
