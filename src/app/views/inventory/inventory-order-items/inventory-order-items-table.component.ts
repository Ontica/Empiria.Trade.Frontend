/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { InventoryOrderItem } from '@app/models';

export enum InventoryOrderItemsTableEventType {
  REMOVE_ITEM_CLICKED = 'InventoryOrderItemsTableComponent.Event.RemoveItemClicked',
}

@Component({
  selector: 'emp-trade-inventory-order-items-table',
  templateUrl: './inventory-order-items-table.component.html',
})
export class InventoryOrderItemsTableComponent implements OnChanges {

  @Input() inventoryOrderItems: InventoryOrderItem[] = [];

  @Output() inventoryOrderItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['vendorProduct', 'warehouseBin', 'notes', 'quantity', 'actionDelete'];

  dataSource: MatTableDataSource<InventoryOrderItem>;


  constructor(private messageBox: MessageBoxService) {

  }


  get hasOrderItems(): boolean {
    return this.inventoryOrderItems.length > 0;
  }


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.inventoryOrderItems ?? []);
  }


  onDeleteItemClicked(event, item: InventoryOrderItem) {
    event.stopPropagation();

    const message = this.getConfirmDeleteMessage(item);

    this.messageBox.confirm(message, 'Eliminar movimiento', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.inventoryOrderItemsTableEvent, InventoryOrderItemsTableEventType.REMOVE_ITEM_CLICKED,
            { inventoryOrderItemUID: item.uid });
        }
      });
  }


  private getConfirmDeleteMessage(item: InventoryOrderItem): string {
    return `
      <table class="confirm-data">
        <tr><td>Producto: </td><td><strong>
          ${item.product?.productCode} - ${item.product?.presentation}
        </strong></td></tr>

        <tr><td>Almacen: </td><td><strong>
          ${item.warehouseBin?.rackDescription} - ${item.warehouseBin?.position} - ${item.warehouseBin?.level}
        </strong></td></tr>

        <tr><td class='nowrap'>Cantidad: </td><td><strong>
          ${item.quantity}
        </strong></td></tr>
      </table>

     <br>¿Elimino el movimiento?`;
  }

}
