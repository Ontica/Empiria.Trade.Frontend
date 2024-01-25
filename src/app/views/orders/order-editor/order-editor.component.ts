/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SalesOrdersDataService } from '@app/data-services';

import { EmptyOrder, Order, OrderFields, mapOrderFieldsFromOrder } from '@app/models';

import { OrderEditionEventType } from '../order-edition/order-edition.component';

export enum OrderEditorEventType {
  ORDER_UPDATED    = 'OrderEditorComponent.Event.OrderUpdated',
  ORDER_APPLIED    = 'OrderEditorComponent.Event.OrderApplied',
  ORDER_AUTHORIZED = 'OrderEditorComponent.Event.OrderAuthorize',
  ORDER_CANCELED   = 'OrderEditorComponent.Event.OrderCanceled',
}

@Component({
  selector: 'emp-trade-order-editor',
  templateUrl: './order-editor.component.html',
})
export class OrderEditorComponent {

  @Input() order: Order = EmptyOrder();

  @Output() orderEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private salesOrdersData: SalesOrdersDataService) { }


  onOrderEditionEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as OrderEditionEventType) {

      case OrderEditionEventType.UPDATE_ORDER:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.updateOrder(mapOrderFieldsFromOrder(event.payload.order as Order));
        return;

      case OrderEditionEventType.APPLY_ORDER:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.applyOrder(event.payload.orderUID);
        return;

      case OrderEditionEventType.AUTHORIZE_ORDER:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.authorizeOrder(event.payload.orderUID);
        return;

      case OrderEditionEventType.CANCEL_ORDER:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.cancelOrder(event.payload.orderUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  updateOrder(order: OrderFields) {
    this.submitted = true;

    this.salesOrdersData.updateOrder(order.uid, order)
      .firstValue()
      .then(x => sendEvent(this.orderEditorEvent, OrderEditorEventType.ORDER_UPDATED, { order: x }))
      .finally(() => this.submitted = false);;
  }


  applyOrder(orderUID: string) {
    this.submitted = true;

    this.salesOrdersData.applyOrder(orderUID)
      .firstValue()
      .then(x => sendEvent(this.orderEditorEvent, OrderEditorEventType.ORDER_APPLIED, { order: x }))
      .finally(() => this.submitted = false);
  }


  authorizeOrder(orderUID: string) {
    this.submitted = true;

    this.salesOrdersData.authorizeOrder(orderUID)
      .firstValue()
      .then(x => sendEvent(this.orderEditorEvent, OrderEditorEventType.ORDER_AUTHORIZED, { order: x }))
      .finally(() => this.submitted = false);
  }


  cancelOrder(orderUID: string) {
    this.submitted = true;

    this.salesOrdersData.cancelOrder(orderUID)
      .firstValue()
      .then(x => sendEvent(this.orderEditorEvent, OrderEditorEventType.ORDER_CANCELED, { orderUID }))
      .finally(() => this.submitted = false);
  }

}
