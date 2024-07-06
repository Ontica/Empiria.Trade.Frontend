/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyPurchaseOrder, PurchaseOrder } from '@app/models';

import { PurchaseOrderEditorEventType } from '../purchase-order/purchase-order-editor.component';


export enum PurchaseOrderTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'PurchaseOrderTabbedViewComponent.Event.CloseButtonClicked',
  ORDER_UPDATED        = 'PurchaseOrderTabbedViewComponent.Event.OrderUpdated',
  ORDER_DELETED        = 'PurchaseOrderTabbedViewComponent.Event.OrderDeleted',
}

@Component({
  selector: 'emp-trade-purchase-order-tabbed-view',
  templateUrl: './purchase-order-tabbed-view.component.html',
})
export class PurchaseOrderTabbedViewComponent implements OnChanges {

  @Input() order: PurchaseOrder = EmptyPurchaseOrder;

  @Output() purchaseOrderTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onClose() {
    sendEvent(this.purchaseOrderTabbedViewEvent, PurchaseOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onPurchaseOrderEditorEvent(event: EventInfo) {
    switch (event.type as PurchaseOrderEditorEventType) {
      case PurchaseOrderEditorEventType.ORDER_UPDATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        sendEvent(this.purchaseOrderTabbedViewEvent, PurchaseOrderTabbedViewEventType.ORDER_UPDATED,
          event.payload);
        return;

      case PurchaseOrderEditorEventType.ORDER_DELETED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        sendEvent(this.purchaseOrderTabbedViewEvent, PurchaseOrderTabbedViewEventType.ORDER_DELETED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    this.title = `${this.order.orderNumber}` +
      `<span class="tag tag-small">${this.order.status.name}</span>`;

    this.hint = `<strong>${this.order.supplier.name} </strong>`;

    if (!!this.order.scheduledTime) {
      const scheduledTime = DateStringLibrary.format(this.order.scheduledTime);
      this.hint += ` &nbsp; &nbsp; | &nbsp; &nbsp; ${scheduledTime}`;
    }
  }

}
