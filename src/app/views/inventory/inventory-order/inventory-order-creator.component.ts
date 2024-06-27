/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { InventoryDataService } from '@app/data-services';

import { InventoryOrderFields } from '@app/models';

import { InventoryOrderHeaderEventType } from './inventory-order-header.component';


export enum InventoryOrderCreatorEventType {
  CLOSE_MODAL_CLICKED = 'InventoryOrderCreatorComponent.Event.CloseModalClicked',
  ORDER_CREATED       = 'InventoryOrderCreatorComponent.Event.OrderCreated',
}

@Component({
  selector: 'emp-trade-inventory-order-creator',
  templateUrl: './inventory-order-creator.component.html',
})
export class InventoryOrderCreatorComponent {

  @Output() inventoryOrderCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private inventoryData: InventoryDataService) { }


  onCloseModalClicked() {
    sendEvent(this.inventoryOrderCreatorEvent, InventoryOrderCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onInventoryOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InventoryOrderHeaderEventType) {
      case InventoryOrderHeaderEventType.CREATE_ORDER:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createOrder(event.payload.dataFields as InventoryOrderFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createOrder(orderFields: InventoryOrderFields) {
    this.submitted = true;

    this.inventoryData.createOrder(orderFields)
      .firstValue()
      .then(x =>
        sendEvent(this.inventoryOrderCreatorEvent, InventoryOrderCreatorEventType.ORDER_CREATED, { order: x })
      )
      .finally(() => this.submitted = false);
  }

}
