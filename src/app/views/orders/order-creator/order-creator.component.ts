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

import { SalesOrdersDataService } from '@app/data-services';

import { Order, OrderFields, mapOrderFieldsFromOrder } from '@app/models';

import { OrderEditionEventType } from '../order-edition/order-edition.component';

export enum OrderCreatorEventType {
  CLOSE_MODAL_CLICKED = 'OrderCreatorComponent.Event.CloseModalClicked',
  ORDER_CREATED       = 'OrderCreatorComponent.Event.OrderCreated',
}

@Component({
  selector: 'emp-trade-order-creator',
  templateUrl: './order-creator.component.html',
})
export class OrderCreatorComponent {

  @Output() orderCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;

  orderDirty = false;

  constructor(private salesOrdersData: SalesOrdersDataService,
              private messageBox: MessageBoxService) { }


  onClose() {
    if (this.orderDirty) {
      this.confirmCloseModal();
    } else {
      this.emitCloseModal();
    }
  }


  onOrderEditionEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as OrderEditionEventType) {

      case OrderEditionEventType.CREATE_ORDER:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        const order = mapOrderFieldsFromOrder(event.payload.order as Order);
        this.createOrder(order);
        return;

      case OrderEditionEventType.ORDER_DIRTY:
        Assertion.assertValue(event.payload.dirty, 'event.payload.dirty');
        this.orderDirty = event.payload.dirty;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  createOrder(order: OrderFields) {
    this.submitted = true;

    this.salesOrdersData.createOrder(order)
      .firstValue()
      .then(x => sendEvent(this.orderCreatorEvent, OrderCreatorEventType.ORDER_CREATED, { order: x }))
      .finally(() => this.submitted = false);
  }


  private emitCloseModal() {
    sendEvent(this.orderCreatorEvent, OrderCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  private confirmCloseModal() {
    const message = `Esta operación descartará los cambios y perderá la información modificada.
                    <br><br>¿Descarto los cambios?`;

    this.messageBox.confirm(message, 'Descartar cambios')
      .firstValue()
      .then(x => {
        if (x) {
          this.emitCloseModal();
        }
      });
  }

}
