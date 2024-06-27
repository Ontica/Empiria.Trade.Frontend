/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ApplicationStatusService, DateStringLibrary, EventInfo } from '@app/core';

import { DefaultOrdersTypeConfig, EmptySaleOrder, SaleOrder, OrdersTypeConfig,
         SalesOrdersQueryType } from '@app/models';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { SaleOrderEditorEventType } from '../sale-order/sale-order-editor.component';

import {
  PackingViewEventType
} from '@app/views/shipping-and-handling/packing/packing-view/packing-view.component';

import { PickingEditorEventType } from '@app/views/shipping-and-handling/picking/picking-editor.component';

export enum SaleOrderTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'SaleOrderTabbedViewComponent.Event.CloseButtonClicked',
  ORDER_UPDATED        = 'SaleOrderTabbedViewComponent.Event.OrderUpdated',
  ORDER_CANCELED       = 'SaleOrderTabbedViewComponent.Event.OrderCanceled',
}

@Component({
  selector: 'emp-trade-sale-order-tabbed-view',
  templateUrl: './sale-order-tabbed-view.component.html',
})
export class SaleOrderTabbedViewComponent implements OnChanges {

  @Input() config: OrdersTypeConfig = DefaultOrdersTypeConfig;

  @Input() order: SaleOrder = EmptySaleOrder();

  @Output() saleOrderTabbedViewEvent = new EventEmitter<EventInfo>();

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


  get showShippingTab(): boolean {
    return this.config.type === SalesOrdersQueryType.Sales && this.order.actions.show.orderData;
  }


  onClose() {
    this.appStatus.canUserContinue()
      .subscribe(x =>
        x ? sendEvent(this.saleOrderTabbedViewEvent, SaleOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED) : null
      );
  }


  onSaleOrderEditorEvent(event: EventInfo) {
    switch (event.type as SaleOrderEditorEventType) {

      case SaleOrderEditorEventType.ORDER_UPDATED:
      case SaleOrderEditorEventType.ORDER_APPLIED:
      case SaleOrderEditorEventType.ORDER_AUTHORIZED:
      case SaleOrderEditorEventType.ORDER_DEAUTHORIZED:
        sendEvent(this.saleOrderTabbedViewEvent, SaleOrderTabbedViewEventType.ORDER_UPDATED, event.payload);
        return;

      case SaleOrderEditorEventType.ORDER_CANCELED:
        sendEvent(this.saleOrderTabbedViewEvent, SaleOrderTabbedViewEventType.ORDER_CANCELED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPickingEditorEvent(event: EventInfo) {
    switch (event.type as PickingEditorEventType) {

      case PickingEditorEventType.PICKING_UPDATED:
        sendEvent(this.saleOrderTabbedViewEvent, SaleOrderTabbedViewEventType.ORDER_UPDATED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPackingViewEvent(event: EventInfo) {
    switch (event.type as PackingViewEventType) {

      case PackingViewEventType.PACKING_UPDATED:
      case PackingViewEventType.ORDER_SUPPLIED:
        sendEvent(this.saleOrderTabbedViewEvent, SaleOrderTabbedViewEventType.ORDER_UPDATED, event.payload);
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

    if (this.config.type === SalesOrdersQueryType.SalesPacking) {
      this.title += this.order?.packing.data.totalPackages ?? '';
    }

    if (this.config.type === SalesOrdersQueryType.SalesAuthorization) {
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
    if (this.selectedTabIndex === 1 && this.showShippingTab && !this.order.actions.show.shippingData) {
      this.selectedTabIndex = 0;
    }
  }

}
