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


export enum PurchaseOrderProductSelectorEventType {
  CLOSE_MODAL_CLICKED = 'PurchaseOrderProductSelectorComponent.Event.CloseModalClicked',
  ADD_PRODUCT         = 'PurchaseOrderProductSelectorComponent.Event.AddProduct',
}

@Component({
  selector: 'emp-trade-purchase-order-product-selector',
  templateUrl: './purchase-order-product-selector.component.html',
})
export class PurchaseOrderProductSelectorComponent {


  @Output() purchaseOrderProductSelectorEvent = new EventEmitter<EventInfo>();


  onClose() {
    sendEvent(this.purchaseOrderProductSelectorEvent,
      PurchaseOrderProductSelectorEventType.CLOSE_MODAL_CLICKED);
  }


  onProductsSeekerEvent(event: EventInfo) {
    switch (event.type as ProductsSeekerEventType) {
      case ProductsSeekerEventType.ADD_PRODUCT:
        Assertion.assert(event.payload.selection, 'event.payload.selection');
        sendEvent(this.purchaseOrderProductSelectorEvent, PurchaseOrderProductSelectorEventType.ADD_PRODUCT,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
