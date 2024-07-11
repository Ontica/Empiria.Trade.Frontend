/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PurchasesDataService } from '@app/data-services';

import { EmptyPurchaseOrder, PurchaseOrder, PurchaseOrderFields } from '@app/models';

import { PurchaseOrderHeaderEventType } from './purchase-order-header.component';


export enum PurchaseOrderEditorEventType {
  ORDER_UPDATED = 'PurchaseOrderEditorComponent.Event.OrderUpdated',
  ORDER_DELETED = 'PurchaseOrderEditorComponent.Event.OrderDeleted',
}

@Component({
  selector: 'emp-trade-purchase-order-editor',
  templateUrl: './purchase-order-editor.component.html',
})
export class PurchaseOrderEditorComponent {

  @Input() order: PurchaseOrder = EmptyPurchaseOrder;

  @Output() purchaseOrderEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private purchasesData: PurchasesDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.order);
  }


  onPurchaseOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as PurchaseOrderHeaderEventType) {
      case PurchaseOrderHeaderEventType.UPDATE_ORDER:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateOrder(event.payload.dataFields as PurchaseOrderFields);
        return;

      case PurchaseOrderHeaderEventType.DELETE_ORDER:
        this.deleteOrder();
        return;

      case PurchaseOrderHeaderEventType.CLOSE_ORDER:
        this.closeOrder();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateOrder(orderFields: PurchaseOrderFields) {
    this.submitted = true;

    this.purchasesData.updateOrder(this.order.uid, orderFields)
      .firstValue()
      .then(x =>
        sendEvent(this.purchaseOrderEditorEvent, PurchaseOrderEditorEventType.ORDER_UPDATED, { order: x })
      )
      .finally(() => this.submitted = false);
  }


  private deleteOrder() {
    this.submitted = true;

    this.purchasesData.deleteOrder(this.order.uid)
      .firstValue()
      .then(x => sendEvent(this.purchaseOrderEditorEvent, PurchaseOrderEditorEventType.ORDER_DELETED,
        { orderUID: this.order.uid }))
      .finally(() => this.submitted = false);
  }


  private closeOrder() {
    this.submitted = true;

    this.purchasesData.closeOrder(this.order.uid)
      .firstValue()
      .then(x =>
        sendEvent(this.purchaseOrderEditorEvent, PurchaseOrderEditorEventType.ORDER_UPDATED, { order: x })
      )
      .finally(() => this.submitted = false);
  }

}
