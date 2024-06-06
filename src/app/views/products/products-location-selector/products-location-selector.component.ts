/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ProductsSeekerEventType } from '../products-seeker/products-seeker.component';


export enum ProductsLocationSelectorEventType {
  CLOSE_MODAL_CLICKED = 'ProductsLocationSelectorComponent.Event.CloseModalClicked',
  ADD_PRODUCT         = 'ProductsLocationSelectorComponent.Event.AddProduct',
}

@Component({
  selector: 'emp-trade-products-location-selector',
  templateUrl: './products-location-selector.component.html',
})
export class ProductsLocationSelectorComponent {

  @Output() productsLocationSelectorEvent = new EventEmitter<EventInfo>();


  onClose() {
    sendEvent(this.productsLocationSelectorEvent, ProductsLocationSelectorEventType.CLOSE_MODAL_CLICKED);
  }


  onProductsSeekerEvent(event: EventInfo) {
    switch (event.type as ProductsSeekerEventType) {

      case ProductsSeekerEventType.ADD_PRODUCT:
        Assertion.assert(event.payload.selection, 'event.payload.selection');

        sendEvent(this.productsLocationSelectorEvent,
          ProductsLocationSelectorEventType.ADD_PRODUCT, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
