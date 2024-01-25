/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { ApplicationStatusService, Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

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


  constructor(private appStatus: ApplicationStatusService,
              private salesOrdersData: SalesOrdersDataService) { }


  onClose() {
    this.appStatus.canUserContinue()
      .subscribe( x =>
        x ? sendEvent(this.orderCreatorEvent, OrderCreatorEventType.CLOSE_MODAL_CLICKED) : null
      );
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

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createOrder(order: OrderFields) {
    this.submitted = true;

    this.salesOrdersData.createOrder(order)
      .firstValue()
      .then(x => sendEvent(this.orderCreatorEvent, OrderCreatorEventType.ORDER_CREATED, { order: x }))
      .finally(() => this.submitted = false);
  }

}
