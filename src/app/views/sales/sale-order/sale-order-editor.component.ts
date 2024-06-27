/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SalesDataService } from '@app/data-services';

import { EmptySaleOrder, SaleOrder, SaleOrderFields, mapSaleOrderFieldsFromSaleOrder } from '@app/models';

import { SaleOrderEditionEventType } from '../sale-order-edition/sale-order-edition.component';

export enum SaleOrderEditorEventType {
  ORDER_UPDATED      = 'SaleOrderEditorComponent.Event.OrderUpdated',
  ORDER_APPLIED      = 'SaleOrderEditorComponent.Event.OrderApplied',
  ORDER_AUTHORIZED   = 'SaleOrderEditorComponent.Event.OrderAuthorize',
  ORDER_DEAUTHORIZED = 'SaleOrderEditorComponent.Event.OrderDeauthorize',
  ORDER_CANCELED     = 'SaleOrderEditorComponent.Event.OrderCanceled',
}

@Component({
  selector: 'emp-trade-sale-order-editor',
  templateUrl: './sale-order-editor.component.html',
})
export class SaleOrderEditorComponent {

  @Input() order: SaleOrder = EmptySaleOrder();

  @Output() saleOrderEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private salesData: SalesDataService) { }


  onSaleOrderEditionEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as SaleOrderEditionEventType) {

      case SaleOrderEditionEventType.UPDATE_ORDER:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.updateOrder(
          mapSaleOrderFieldsFromSaleOrder(event.payload.order as SaleOrder)
        );
        return;

      case SaleOrderEditionEventType.APPLY_ORDER:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.applyOrder(event.payload.orderUID);
        return;

      case SaleOrderEditionEventType.AUTHORIZE_ORDER:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.authorizeOrder(event.payload.orderUID);
        return;

      case SaleOrderEditionEventType.DEAUTHORIZE_ORDER:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.notes, 'event.payload.notes');
        this.deauthorizeOrder(event.payload.orderUID, event.payload.notes);
        return;

      case SaleOrderEditionEventType.CANCEL_ORDER:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.cancelOrder(event.payload.orderUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  updateOrder(order: SaleOrderFields) {
    this.submitted = true;

    this.salesData.updateOrder(order.uid, order)
      .firstValue()
      .then(x => sendEvent(this.saleOrderEditorEvent, SaleOrderEditorEventType.ORDER_UPDATED, { order: x }))
      .finally(() => this.submitted = false);;
  }


  applyOrder(orderUID: string) {
    this.submitted = true;

    this.salesData.applyOrder(orderUID)
      .firstValue()
      .then(x => sendEvent(this.saleOrderEditorEvent, SaleOrderEditorEventType.ORDER_APPLIED, { order: x }))
      .finally(() => this.submitted = false);
  }


  authorizeOrder(orderUID: string) {
    this.submitted = true;

    this.salesData.authorizeOrder(orderUID)
      .firstValue()
      .then(x => sendEvent(this.saleOrderEditorEvent, SaleOrderEditorEventType.ORDER_AUTHORIZED, { order: x }))
      .finally(() => this.submitted = false);
  }


  deauthorizeOrder(orderUID: string, notes: string) {
    this.submitted = true;

    this.salesData.deauthorizeOrder(orderUID, notes)
      .firstValue()
      .then(x => sendEvent(this.saleOrderEditorEvent, SaleOrderEditorEventType.ORDER_DEAUTHORIZED, { order: x }))
      .finally(() => this.submitted = false);
  }


  cancelOrder(orderUID: string) {
    this.submitted = true;

    this.salesData.cancelOrder(orderUID)
      .firstValue()
      .then(x => sendEvent(this.saleOrderEditorEvent, SaleOrderEditorEventType.ORDER_CANCELED, { orderUID }))
      .finally(() => this.submitted = false);
  }

}
