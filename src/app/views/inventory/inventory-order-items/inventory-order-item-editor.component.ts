/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import {
  ProductLocationInputEventType
} from '@app/views/products/product-location/product-location-input.component';


export enum InventoryOrderItemEditorEventType {
  CLOSE_BUTTON_CLICKED  = 'InventoryOrderItemEditorComponent.Event.CloseButtonClicked',
  ADD_BUTTON_CLICKED    = 'InventoryOrderItemEditorComponent.Event.AddButtonClicked',
}

@Component({
  selector: 'emp-trade-inventory-order-item-editor',
  templateUrl: './inventory-order-item-editor.component.html',
})
export class InventoryOrderItemEditorComponent {

  @Input() orderUID: string = null;

  @Input() assignedQuantity = null;

  @Output() inventoryOrderItemEditorEvent = new EventEmitter<EventInfo>();


  onCloseButtonClicked() {
    sendEvent(this.inventoryOrderItemEditorEvent,
      InventoryOrderItemEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onProductLocationInputEvent(event: EventInfo) {
    switch (event.type as ProductLocationInputEventType) {
      case ProductLocationInputEventType.ADD_BUTTON_CLICKED:
        Assertion.assert(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assert(event.payload.dataFields, 'event.payload.dataFields');
        sendEvent(this.inventoryOrderItemEditorEvent,
          InventoryOrderItemEditorEventType.ADD_BUTTON_CLICKED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
