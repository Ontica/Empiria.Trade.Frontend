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


export enum InventoryOrderTabbedViewEventType {
  CLOSE_BUTTON_CLICKED    = 'InventoryOrderTabbedViewComponent.Event.CloseButtonClicked',
  INVENTORY_ORDER_UPDATED = 'InventoryOrderTabbedViewComponent.Event.InventoryOrderUpdated',
  INVENTORY_ORDER_DELETED = 'InventoryOrderTabbedViewComponent.Event.InventoryOrderDeleted',
}

@Component({
  selector: 'emp-trade-inventory-order-tabbed-view',
  templateUrl: './inventory-order-tabbed-view.component.html',
})
export class InventoryOrderTabbedViewComponent implements OnChanges {

  @Input() inventoryOrder: InventoryOrder = EmptyInventoryOrder;

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
        Assertion.assertValue(event.payload.inventoryOrder, 'event.payload.inventoryOrder');
        sendEvent(this.inventoryOrderTabbedViewEvent,
          InventoryOrderTabbedViewEventType.INVENTORY_ORDER_UPDATED, event.payload);
        return;

      case InventoryOrderEditorEventType.ORDER_DELETED:
        Assertion.assertValue(event.payload.inventoryOrder, 'event.payload.inventoryOrder');
        sendEvent(this.inventoryOrderTabbedViewEvent,
          InventoryOrderTabbedViewEventType.INVENTORY_ORDER_DELETED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const postingTime = DateStringLibrary.format(this.inventoryOrder.postingTime);

    this.title = `${this.inventoryOrder.inventoryOrderNo}` +
      `<span class="tag tag-small">${this.inventoryOrder.status}</span>`;

    this.hint = `<strong>${this.inventoryOrder.inventoryOrderType.name} </strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; ${postingTime}`;
  }

}
