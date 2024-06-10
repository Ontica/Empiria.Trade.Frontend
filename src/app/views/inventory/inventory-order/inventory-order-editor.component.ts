/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { InventoryOrdersDataService } from '@app/data-services';

import { EmptyInventoryOrder, InventoryOrder, InventoryOrderFields } from '@app/models';

import { InventoryOrderHeaderEventType } from './inventory-order-header.component';


export enum InventoryOrderEditorEventType {
  ORDER_UPDATED = 'InventoryOrderEditorComponent.Event.OrderUpdated',
  ORDER_DELETED = 'InventoryOrderEditorComponent.Event.OrderDeleted',
}

@Component({
  selector: 'emp-trade-inventory-order-editor',
  templateUrl: './inventory-order-editor.component.html',
})
export class InventoryOrderEditorComponent {

  @Input() inventoryOrder: InventoryOrder = EmptyInventoryOrder;

  @Output() inventoryOrderEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private inventoryOrdersData: InventoryOrdersDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.inventoryOrder);
  }


  onInventoryOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InventoryOrderHeaderEventType) {
      case InventoryOrderHeaderEventType.UPDATE_INVENTORY_ORDER:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateInventoryOrder(event.payload.dataFields as InventoryOrderFields);
        return;

      case InventoryOrderHeaderEventType.DELETE_INVENTORY_ORDER:
        this.deleteInventoryOrder();
        return;

      case InventoryOrderHeaderEventType.CLOSE_INVENTORY_ORDER:
        this.closeInventoryOrder();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateInventoryOrder(inventoryOrderFields: InventoryOrderFields) {
    this.submitted = true;

    this.inventoryOrdersData.updateInventoryOrder(this.inventoryOrder.uid, inventoryOrderFields)
      .firstValue()
      .then(x => this.resolveUpdateInventoryOrder(x))
      .finally(() => this.submitted = false);
  }


  private deleteInventoryOrder() {
    this.submitted = true;

    this.inventoryOrdersData.deleteInventoryOrder(this.inventoryOrder.uid)
      .firstValue()
      .then(x => this.resolveDeleteInventoryOrder(x))
      .finally(() => this.submitted = false);
  }


  private closeInventoryOrder() {
    this.submitted = true;

    this.inventoryOrdersData.closeInventoryOrder(this.inventoryOrder.uid)
      .firstValue()
      .then(x => this.resolveUpdateInventoryOrder(x))
      .finally(() => this.submitted = false);
  }


  private resolveUpdateInventoryOrder(inventoryOrder: InventoryOrder) {
    const payload = { inventoryOrder };
    sendEvent(this.inventoryOrderEditorEvent, InventoryOrderEditorEventType.ORDER_UPDATED, payload);
  }


  private resolveDeleteInventoryOrder(inventoryOrder: InventoryOrder) {
    const payload = { inventoryOrder };
    sendEvent(this.inventoryOrderEditorEvent, InventoryOrderEditorEventType.ORDER_DELETED, payload);
  }

}
