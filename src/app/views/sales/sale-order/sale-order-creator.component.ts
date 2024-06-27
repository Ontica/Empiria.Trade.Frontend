/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { ApplicationStatusService, Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SalesDataService } from '@app/data-services';

import { SaleOrder, SaleOrderFields, mapSaleOrderFieldsFromSaleOrder } from '@app/models';

import { SaleOrderEditionEventType } from '../sale-order-edition/sale-order-edition.component';


export enum SaleOrderCreatorEventType {
  CLOSE_MODAL_CLICKED = 'SaleOrderCreatorComponent.Event.CloseModalClicked',
  ORDER_CREATED       = 'SaleOrderCreatorComponent.Event.OrderCreated',
}

@Component({
  selector: 'emp-trade-sale-order-creator',
  templateUrl: './sale-order-creator.component.html',
})
export class SaleOrderCreatorComponent {

  @Output() saleOrderCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private appStatus: ApplicationStatusService,
              private salesData: SalesDataService) { }


  onClose() {
    this.appStatus.canUserContinue()
      .subscribe( x =>
        x ? sendEvent(this.saleOrderCreatorEvent, SaleOrderCreatorEventType.CLOSE_MODAL_CLICKED) : null
      );
  }


  onSaleOrderEditionEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as SaleOrderEditionEventType) {

      case SaleOrderEditionEventType.CREATE_ORDER:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        const order = mapSaleOrderFieldsFromSaleOrder(event.payload.order as SaleOrder);
        this.createOrder(order);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createOrder(order: SaleOrderFields) {
    this.submitted = true;

    this.salesData.createOrder(order)
      .firstValue()
      .then(x => sendEvent(this.saleOrderCreatorEvent, SaleOrderCreatorEventType.ORDER_CREATED, { order: x }))
      .finally(() => this.submitted = false);
  }

}
