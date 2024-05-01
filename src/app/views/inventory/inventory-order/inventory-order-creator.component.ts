/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { InventoryOrdersDataService } from '@app/data-services';

import { InventoryOrder, InventoryOrderFields } from '@app/models';

import { InventoryOrderHeaderEventType } from './inventory-order-header.component';


export enum InventoryOrderCreatorEventType {
  CLOSE_MODAL_CLICKED     = 'InventoryOrderCreatorComponent.Event.CloseModalClicked',
  INVENTORY_ORDER_CREATED = 'InventoryOrderEditorComponent.Event.InventoryOrderCreated',
}

@Component({
  selector: 'emp-trade-inventory-order-creator',
  templateUrl: './inventory-order-creator.component.html',
})
export class InventoryOrderCreatorComponent {

  @Output() inventoryOrderCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private inventoryOrdersData: InventoryOrdersDataService) { }


  onCloseModalClicked() {
    sendEvent(this.inventoryOrderCreatorEvent, InventoryOrderCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onInventoryOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InventoryOrderHeaderEventType) {
      case InventoryOrderHeaderEventType.CREATE_INVENTORY_ORDER:
        Assertion.assertValue(event.payload.inventoryOrder, 'event.payload.inventoryOrder');
        this.createInventoryOrder(event.payload.inventoryOrder as InventoryOrderFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createInventoryOrder(inventoryOrderFields: InventoryOrderFields) {
    this.submitted = true;

    this.inventoryOrdersData.createInventoryOrder(inventoryOrderFields)
      .firstValue()
      .then(x => this.resolveCreateInventoryOrder(x))
      .finally(() => this.submitted = false);
  }


  private resolveCreateInventoryOrder(inventoryOrder: InventoryOrder) {
    const payload = { inventoryOrder };
    sendEvent(this.inventoryOrderCreatorEvent, InventoryOrderCreatorEventType.INVENTORY_ORDER_CREATED,
      payload);
  }

}
