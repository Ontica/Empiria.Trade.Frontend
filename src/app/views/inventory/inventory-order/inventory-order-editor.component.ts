/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { InventoryDataService } from '@app/data-services';

import { EmptyOrder, EmptyOrderActions, InventoryOrderFields, Order, OrderActions } from '@app/models';

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

  @Input() order: Order = EmptyOrder;

  @Input() actions: OrderActions = EmptyOrderActions;

  @Output() inventoryOrderEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private inventoryData: InventoryDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.order);
  }


  onInventoryOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InventoryOrderHeaderEventType) {
      case InventoryOrderHeaderEventType.UPDATE_ORDER:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateOrder(event.payload.dataFields as InventoryOrderFields);
        return;
      case InventoryOrderHeaderEventType.DELETE_ORDER:
        this.deleteOrder();
        return;
      case InventoryOrderHeaderEventType.CLOSE_ORDER:
        this.closeOrder();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateOrder(orderFields: InventoryOrderFields) {
    this.submitted = true;

    this.inventoryData.updateOrder(this.order.uid, orderFields)
      .firstValue()
      .then(x =>
        sendEvent(this.inventoryOrderEditorEvent, InventoryOrderEditorEventType.ORDER_UPDATED, { order: x })
      )
      .finally(() => this.submitted = false);
  }


  private deleteOrder() {
    this.submitted = true;

    this.inventoryData.deleteOrder(this.order.uid)
      .firstValue()
      .then(x =>
        sendEvent(this.inventoryOrderEditorEvent, InventoryOrderEditorEventType.ORDER_DELETED, { order: x })
      )
      .finally(() => this.submitted = false);
  }


  private closeOrder() {
    this.submitted = true;

    this.inventoryData.closeOrder(this.order.uid)
      .firstValue()
      .then(x =>
        sendEvent(this.inventoryOrderEditorEvent, InventoryOrderEditorEventType.ORDER_UPDATED, { order: x })
      )
      .finally(() => this.submitted = false);
  }

}
