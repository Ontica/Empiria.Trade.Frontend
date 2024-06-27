/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SaleOrder, SaleOrderFields, mapSaleOrderFieldsFromSaleOrder } from '@app/models';

import { ProductsSeekerEventType } from '../products-seeker/products-seeker.component';


export enum ProductsSelectorEventType {
  CLOSE_MODAL_CLICKED = 'ProductsSelectorComponent.Event.CloseModalClicked',
  ADD_PRODUCT         = 'ProductsSelectorComponent.Event.AddProduct',
}

@Component({
  selector: 'emp-trade-products-selector',
  templateUrl: './products-selector.component.html',
})
export class ProductsSelectorComponent implements OnChanges {

  @Input() order: SaleOrder = null;

  @Output() productsSelectorEvent = new EventEmitter<EventInfo>();

  orderForQuery: SaleOrderFields = null;


  ngOnChanges() {
    this.orderForQuery = mapSaleOrderFieldsFromSaleOrder(this.order);
  }


  onClose() {
    sendEvent(this.productsSelectorEvent, ProductsSelectorEventType.CLOSE_MODAL_CLICKED);
  }


  onProductsSeekerEvent(event: EventInfo) {
    switch (event.type as ProductsSeekerEventType) {

      case ProductsSeekerEventType.SELECT_PRODUCT:
        Assertion.assertValue(event.payload.product, 'event.payload.product');

        return;

      case ProductsSeekerEventType.ADD_PRODUCT:
        Assertion.assert(event.payload.selection, 'event.payload.selection');

        sendEvent(this.productsSelectorEvent, ProductsSelectorEventType.ADD_PRODUCT, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
