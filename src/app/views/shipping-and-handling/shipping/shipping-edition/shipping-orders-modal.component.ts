/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptyShipping, Shipping } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ShippingOrdersTableEventType } from './shipping-orders-table.component';

export enum ShippingOrdersModalEventType {
  CLOSE_MODAL_CLICKED = 'ShippingOrdersModalComponent.Event.CloseEditorClicked',
  CHANGE_ORDERS       = 'ShippingOrdersModalComponent.Event.ChangeOrders',
  ADD_ORDER           = 'ShippingOrdersModalComponent.Event.AddOrder',
  REMOVE_ORDER        = 'ShippingOrdersModalComponent.Event.RemoveOrder',
}

@Component({
  selector: 'emp-trade-shipping-orders-modal',
  templateUrl: './shipping-orders-modal.component.html',
})
export class ShippingOrdersModalComponent {

  @Input() shipping: Shipping = EmptyShipping;

  @Input() canEdit = false;

  @Output() shippingOrdersModalEvent = new EventEmitter<EventInfo>();


  onClose() {
    sendEvent(this.shippingOrdersModalEvent, ShippingOrdersModalEventType.CLOSE_MODAL_CLICKED);
  }


  onShippingOrdersTableEvent(event: EventInfo) {
    switch (event.type as ShippingOrdersTableEventType) {

      case ShippingOrdersTableEventType.CHANGE_ORDERS:
        Assertion.assertValue(event.payload.orders, 'event.payload.orders');
        sendEvent(this.shippingOrdersModalEvent, ShippingOrdersModalEventType.CHANGE_ORDERS, event.payload);
        return;

      case ShippingOrdersTableEventType.ADD_ORDER:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        sendEvent(this.shippingOrdersModalEvent, ShippingOrdersModalEventType.ADD_ORDER, event.payload);
        return;

      case ShippingOrdersTableEventType.REMOVE_ORDER:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        sendEvent(this.shippingOrdersModalEvent, ShippingOrdersModalEventType.REMOVE_ORDER, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
