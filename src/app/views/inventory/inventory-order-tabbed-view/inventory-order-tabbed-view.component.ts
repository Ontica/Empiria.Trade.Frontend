/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyInventoryOrder, InventoryOrder } from '@app/models';

import { InventoryOrderEditorEventType } from '../inventory-order/inventory-order-editor.component';

import {
  InventoryOrderItemsEditionEventType
} from '../inventory-order-items/inventory-order-items-edition.component';


export enum InventoryOrderTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'InventoryOrderTabbedViewComponent.Event.CloseButtonClicked',
  ORDER_UPDATED        = 'InventoryOrderTabbedViewComponent.Event.OrderUpdated',
  ORDER_DELETED        = 'InventoryOrderTabbedViewComponent.Event.OrderDeleted',
}

@Component({
  selector: 'emp-trade-inventory-order-tabbed-view',
  templateUrl: './inventory-order-tabbed-view.component.html',
})
export class InventoryOrderTabbedViewComponent implements OnChanges {

  @Input() order: InventoryOrder = EmptyInventoryOrder;

  @Output() inventoryOrderTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onClose() {
    sendEvent(this.inventoryOrderTabbedViewEvent, InventoryOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onInventoryOrderEditorEvent(event: EventInfo) {
    switch (event.type as InventoryOrderEditorEventType) {
      case InventoryOrderEditorEventType.ORDER_UPDATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        sendEvent(this.inventoryOrderTabbedViewEvent, InventoryOrderTabbedViewEventType.ORDER_UPDATED,
          event.payload);
        return;

      case InventoryOrderEditorEventType.ORDER_DELETED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        sendEvent(this.inventoryOrderTabbedViewEvent, InventoryOrderTabbedViewEventType.ORDER_DELETED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrderItemsEditionEvent(event: EventInfo) {
    switch (event.type as InventoryOrderItemsEditionEventType) {
      case InventoryOrderItemsEditionEventType.ITEM_CREATED:
      case InventoryOrderItemsEditionEventType.ITEM_DELETED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        sendEvent(this.inventoryOrderTabbedViewEvent, InventoryOrderTabbedViewEventType.ORDER_UPDATED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const postingTime = DateStringLibrary.format(this.order.postingTime);

    this.title = `${this.order.inventoryOrderNo}` +
      `<span class="tag tag-small">${this.order.status}</span>`;

    this.hint = `<strong>${this.order.inventoryOrderType.name} </strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; ${postingTime}`;
  }

}
