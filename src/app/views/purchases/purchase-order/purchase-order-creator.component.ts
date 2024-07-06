/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PurchasesDataService } from '@app/data-services';

import { PurchaseOrderFields } from '@app/models';

import { PurchaseOrderHeaderEventType } from './purchase-order-header.component';


export enum PurchaseOrderCreatorEventType {
  CLOSE_MODAL_CLICKED = 'PurchaseOrderCreatorComponent.Event.CloseModalClicked',
  ORDER_CREATED       = 'PurchaseOrderCreatorComponent.Event.OrderCreated',
}

@Component({
  selector: 'emp-trade-purchase-order-creator',
  templateUrl: './purchase-order-creator.component.html',
})
export class PurchaseOrderCreatorComponent {

  @Output() purchaseOrderCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private purchasesData: PurchasesDataService) { }


  onCloseModalClicked() {
    sendEvent(this.purchaseOrderCreatorEvent, PurchaseOrderCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onPurchaseOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as PurchaseOrderHeaderEventType) {
      case PurchaseOrderHeaderEventType.CREATE_ORDER:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createOrder(event.payload.dataFields as PurchaseOrderFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createOrder(orderFields: PurchaseOrderFields) {
    this.submitted = true;

    this.purchasesData.createOrder(orderFields)
      .firstValue()
      .then(x =>
        sendEvent(this.purchaseOrderCreatorEvent, PurchaseOrderCreatorEventType.ORDER_CREATED, { order: x })
      )
      .finally(() => this.submitted = false);
  }

}
