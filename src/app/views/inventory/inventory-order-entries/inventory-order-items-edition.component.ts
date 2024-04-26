/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { InventoryOrderItem } from '@app/models';

import { InventoryOrderItemsTableEventType } from './inventory-order-items-table.component';

@Component({
  selector: 'emp-trade-inventory-order-items-edition',
  templateUrl: './inventory-order-items-edition.component.html',
})
export class InventoryOrderItemsEditionComponent {

  @Input() inventoryOrderItems: InventoryOrderItem[] = [];

  submitted = false;


  constructor(private messageBox: MessageBoxService) {

  }


  onAddItemClicked() {
    this.messageBox.showInDevelopment('Agregar movimiento');
  }


  onInventoryOrderItemsTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InventoryOrderItemsTableEventType) {

      case InventoryOrderItemsTableEventType.UPDATE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.voucherEntry.item');
        this.messageBox.showInDevelopment('Actualizar movimiento', event.payload.item);
        return;

      case InventoryOrderItemsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        this.messageBox.showInDevelopment('Eliminar movimiento', event.payload.item);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
