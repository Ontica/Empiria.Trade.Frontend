/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { InventoryDataService } from '@app/data-services';

import { InventoryOrderFields } from '@app/models';

import { InventoryOrderHeaderEventType } from './inventory-order-header.component';


export enum InventoryOrderCreatorEventType {
  CLOSE_MODAL_CLICKED = 'InventoryOrderCreatorComponent.Event.CloseModalClicked',
  CREATED             = 'InventoryOrderCreatorComponent.Event.OrderCreated',
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


  @SkipIf('submitted')
  onInventoryOrderHeaderEvent(event: EventInfo) {
    switch (event.type as InventoryOrderHeaderEventType) {
      case InventoryOrderHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createOrder(event.payload.dataFields as InventoryOrderFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createOrder(dataFields: InventoryOrderFields) {
    this.submitted = true;

    this.inventoryData.createOrder(dataFields)
      .firstValue()
      .then(x => sendEvent(this.inventoryOrderCreatorEvent, InventoryOrderCreatorEventType.CREATED, {data: x}))
      .finally(() => this.submitted = false);
  }

}
