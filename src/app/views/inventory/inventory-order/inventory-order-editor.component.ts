/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyInventoryOrder, InventoryOrder } from '@app/models';

import { InventoryOrderHeaderEventType } from './inventory-order-header.component';

@Component({
  selector: 'emp-trade-inventory-order-editor',
  templateUrl: './inventory-order-editor.component.html',
})
export class InventoryOrderEditorComponent {

  @Input() inventoryOrder: InventoryOrder = EmptyInventoryOrder;

  submitted = false;


  constructor(private messageBox: MessageBoxService) {

  }


  onInventoryOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InventoryOrderHeaderEventType) {
      case InventoryOrderHeaderEventType.UPDATE_INVENTORY_ORDER:
        Assertion.assertValue(event.payload.inventoryOrder, 'event.payload.inventoryOrder');
        this.messageBox.showInDevelopment('Actualizar orden de inventario', event.payload.inventoryOrder);
        return;

      case InventoryOrderHeaderEventType.DELETE_INVENTORY_ORDER:
        Assertion.assertValue(event.payload.inventoryOrderUID, 'event.payload.inventoryOrderUID');
        this.messageBox.showInDevelopment('Eliminar orden de inventario', event.payload.inventoryOrderUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
