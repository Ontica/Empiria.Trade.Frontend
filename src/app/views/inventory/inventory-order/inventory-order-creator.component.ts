/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { InventoryOrderHeaderEventType } from './inventory-order-header.component';

export enum InventoryOrderCreatorEventType {
  CLOSE_MODAL_CLICKED = 'InventoryOrderCreatorComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-trade-inventory-order-creator',
  templateUrl: './inventory-order-creator.component.html',
})
export class InventoryOrderCreatorComponent {

  @Output() inventoryOrderCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private messageBox: MessageBoxService) {

  }


  onCloseModalClicked() {
    sendEvent(this.inventoryOrderCreatorEvent, InventoryOrderCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onInventoryOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InventoryOrderHeaderEventType) {
      case InventoryOrderHeaderEventType.CREATE_INVENTORY_ORDER:
        Assertion.assertValue(event.payload.inventoryOrder, 'event.payload.inventoryOrder');
        this.messageBox.showInDevelopment('Agregar orden de inventario', event.payload.inventoryOrder);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
