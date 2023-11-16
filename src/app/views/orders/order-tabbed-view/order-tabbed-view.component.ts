/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { EmptyOrder, Order, OrderQueryType, OrderTypeConfig } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { OrderEditorEventType } from '../order-editor/order-editor.component';

export enum OrderTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'OrderTabbedViewComponent.Event.CloseButtonClicked',
  ORDER_UPDATED        = 'OrderTabbedViewComponent.Event.OrderUpdated',
  ORDER_CANCELED        = 'OrderTabbedViewComponent.Event.OrderCanceled',
}

@Component({
  selector: 'emp-trade-order-tabbed-view',
  templateUrl: './order-tabbed-view.component.html',
})
export class OrderTabbedViewComponent implements OnChanges {

  @Input() config: OrderTypeConfig = {
    type: OrderQueryType.Sales,
    titleText: 'Pedido',
    itemText: 'pedido',
  };

  @Input() order: Order = EmptyOrder();

  @Output() orderTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;

  editionMode = false;

  orderDirty = false;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.setTitle();
  }


  get showSaleTab(): boolean {
    return this.config.type === OrderQueryType.Sales || this.config.type === OrderQueryType.SalesAuthorization;
  }


  get showPackagingTab(): boolean {
    return this.config.type === OrderQueryType.SalesPackaging;
  }


  onClose() {
    if (this.editionMode) {
      this.confirmClose();
      return;
    }
    this.emitCloseTabbed();
  }


  onOrderEditorEvent(event: EventInfo): void {

    switch (event.type as OrderEditorEventType) {

      case OrderEditorEventType.ORDER_UPDATED:
      case OrderEditorEventType.ORDER_APPLIED:
      case OrderEditorEventType.ORDER_AUTHORIZED:
        sendEvent(this.orderTabbedViewEvent, OrderTabbedViewEventType.ORDER_UPDATED, event.payload);
        return;

      case OrderEditorEventType.ORDER_CANCELED:
        sendEvent(this.orderTabbedViewEvent, OrderTabbedViewEventType.ORDER_CANCELED, event.payload);
        return;

      case OrderEditorEventType.EDITION_MODE:
        this.editionMode = event.payload.editionMode;
        return;

      case OrderEditorEventType.ORDER_DIRTY:
        this.orderDirty = event.payload.dirty;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const orderTime = DateStringLibrary.format(this.order.orderTime);
    const orderTotal = FormatLibrary.numberWithCommas(this.order.orderTotal, '1.2-2');

    this.title = `${this.order.orderNumber}`;

    this.hint = `<strong>${this.order.customer.name} </strong> &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${orderTime} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${orderTotal} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `<span class="tag tag-small">${this.order.status}</span>`;
  }


  private confirmClose() {
    const message = `Esta operación descartará los cambios y perderá la información modificada.
                    <br><br>¿Descarto los cambios?`;

    this.messageBox.confirm(message, 'Descartar cambios')
      .firstValue()
      .then(x => {
        if (x) {
          this.emitCloseTabbed();
        }
      });
  }


  private emitCloseTabbed() {
    sendEvent(this.orderTabbedViewEvent, OrderTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }

}
