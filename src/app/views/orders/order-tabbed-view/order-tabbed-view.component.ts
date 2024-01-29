/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ApplicationStatusService, DateStringLibrary, EventInfo } from '@app/core';

import { EmptyOrder, Order, OrderQueryType, OrderTypeConfig } from '@app/models';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import {
  PackingViewEventType
} from '@app/views/shipping-and-handling/packing/packing-view/packing-view.component';

import { OrderEditorEventType } from '../order-editor/order-editor.component';

export enum OrderTabbedViewEventType {
  CLOSE_BUTTON_CLICKED   = 'OrderTabbedViewComponent.Event.CloseButtonClicked',
  ORDER_UPDATED          = 'OrderTabbedViewComponent.Event.OrderUpdated',
  ORDER_CANCELED         = 'OrderTabbedViewComponent.Event.OrderCanceled',
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


  constructor(private appStatus: ApplicationStatusService) { }


  ngOnChanges(changes: SimpleChanges) {
    this.setTitle();

    if (changes.order) {
      this.validateSelectedTabIndex();
    }
  }


  get showOrderTab(): boolean {
    return this.config.type === OrderQueryType.Sales || this.config.type === OrderQueryType.SalesAuthorization;
  }


  get showCreditTab(): boolean {
    return this.config.type === OrderQueryType.SalesAuthorization;
  }


  get showPackingTab(): boolean {
    return this.config.type === OrderQueryType.SalesPacking;
  }


  get showShippingTab(): boolean {
    return this.config.type === OrderQueryType.Sales;
  }


  get shippingTabEnabled(): boolean {
    return ['CarrierSelector', 'Delivery'].includes(this.order.orderData.status);
  }


  get canPacking(): boolean {
    return this.order.orderData.status === 'Packing';
  }


  get canShipping(): boolean {
    return this.order.orderData.status === 'CarrierSelector';
  }


  onClose() {
    this.appStatus.canUserContinue()
      .subscribe(x =>
        x ? sendEvent(this.orderTabbedViewEvent, OrderTabbedViewEventType.CLOSE_BUTTON_CLICKED) : null
      );
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

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPackingViewEvent(event: EventInfo) {
    switch (event.type as PackingViewEventType) {

      case PackingViewEventType.ORDER_PACKING_UPDATED:
      case PackingViewEventType.ORDER_SUPPLIED:
        sendEvent(this.orderTabbedViewEvent, OrderTabbedViewEventType.ORDER_UPDATED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const orderTime = DateStringLibrary.format(this.order.orderData.orderTime);
    const orderTotal = FormatLibrary.numberWithCommas(this.order.orderData.orderTotal, '1.2-2');

    this.title = `${this.order.orderData.orderNumber}`;

    if (this.config.type === OrderQueryType.SalesPacking) {
      this.title += this.order?.packing.data.totalPackages ?? '';
    }

    if (this.config.type === OrderQueryType.SalesAuthorization) {
      this.title += this.order.customerCredit?.totalDebt > 0 ?
        `<span class="tag tag-medium tag-base-warning">Adeudo: &nbsp; ` +
        `${FormatLibrary.numberWithCommas(this.order.customerCredit?.totalDebt, '1.2-2')}</span>` :
        '<span class="tag tag-medium tag-base">sin adeudo</span>';
    }

    this.hint = `<strong>${this.order.orderData.customer.name} </strong> &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${orderTime} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${orderTotal} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `<span class="tag tag-small">${this.order.orderData.statusName}</span>`;
  }


  private validateSelectedTabIndex() {
    if (this.selectedTabIndex === 1 && this.showOrderTab && !this.showCreditTab &&
        this.showShippingTab && !this.shippingTabEnabled) {
      this.selectedTabIndex = 0;
    }
  }

}
