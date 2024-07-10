/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ProductsSeekerEventType } from '@app/views/products/products-seeker/products-seeker.component';


export enum InventoryOrderProductSelectorEventType {
  CLOSE_MODAL_CLICKED = 'InventoryOrderProductSelectorComponent.Event.CloseModalClicked',
  ADD_PRODUCT         = 'InventoryOrderProductSelectorComponent.Event.AddProduct',
}

@Component({
  selector: 'emp-trade-inventory-order-product-selector',
  templateUrl: './inventory-order-product-selector.component.html',
})
export class InventoryOrderProductSelectorComponent {


  @Output() inventoryOrderProductSelectorEvent = new EventEmitter<EventInfo>();


  onClose() {
    sendEvent(this.inventoryOrderProductSelectorEvent,
      InventoryOrderProductSelectorEventType.CLOSE_MODAL_CLICKED);
  }


  onProductsSeekerEvent(event: EventInfo) {
    switch (event.type as ProductsSeekerEventType) {
      case ProductsSeekerEventType.ADD_PRODUCT:
        Assertion.assert(event.payload.selection, 'event.payload.selection');
        sendEvent(this.inventoryOrderProductSelectorEvent,
          InventoryOrderProductSelectorEventType.ADD_PRODUCT, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
