/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { ArrayLibrary, clone } from '@app/shared/utils';

import { EmptyOrder, Order, OrderQuery } from '@app/models';

import { SalesOrdersDataService } from '@app/data-services';

import { OrderCreatorEventType } from '@app/views/sales/order-creator/order-creator.component';

import { OrderTabbedViewEventType } from '@app/views/sales/order-tabbed-view/order-tabbed-view.component';

import { OrdersListingEventType } from '@app/views/sales/orders-listing/orders-listing.component';


@Component({
  selector: 'emp-trade-sales-main-page',
  templateUrl: './sales-main-page.component.html',
})
export class SalesMainPageComponent {

  isLoading = false;

  queryExecuted = false;

  ordersList: Order[] = []

  orderSelected: Order = EmptyOrder();

  displaySecondaryView = false;

  displayOrderCreator = false;


  constructor(private salesOrdersData: SalesOrdersDataService) {}


  onOrderCreatorEvent(event: EventInfo) {
    switch (event.type as OrderCreatorEventType) {
      case OrderCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayOrderCreator = false;
        return;

      case OrderCreatorEventType.ORDER_CREATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.insertOrderToList(event.payload.order as Order);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrdersListingEvent(event: EventInfo) {
    switch (event.type as OrdersListingEventType) {
      case OrdersListingEventType.CREATE_ORDER:
        this.setOrderSelected(EmptyOrder());
        this.displayOrderCreator = true;
        return;

      case OrdersListingEventType.SEARCH_ORDERS:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.searchOrders(event.payload.query as OrderQuery);
        return;

      case OrdersListingEventType.SELECT_ORDER:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        this.setOrderSelected(event.payload.entry as Order);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;

    }
  }


  onOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as OrderTabbedViewEventType) {
      case OrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setOrderSelected(EmptyOrder());
        return;

      case OrderTabbedViewEventType.ORDER_UPDATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.insertOrderToList(event.payload.order as Order);
        return;

      case OrderTabbedViewEventType.ORDER_CANCELED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.removeOrderFromList(event.payload.orderUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchOrders(query: OrderQuery) {
    this.clearData();

    this.salesOrdersData.searchOrders(query)
      .firstValue()
      .then(x => this.setOrderData(x))
      .finally(() => this.isLoading = false)
  }


  private setOrderData(data: Order[]) {
    this.ordersList = data;
    this.queryExecuted = true;
  }


  private clearData() {
    this.ordersList = [];
    this.isLoading = true;
    this.queryExecuted = false;

    this.setOrderSelected(EmptyOrder());
  }


  private setOrderSelected(order: Order) {
    this.orderSelected = clone(order);
    this.displaySecondaryView = !!this.orderSelected.uid;
  }


  private insertOrderToList(order: Order) {
    this.displayOrderCreator = false;
    const newOrdersList = ArrayLibrary.insertItemTop(this.ordersList, order, 'uid');
    this.setOrderData(newOrdersList);
    this.setOrderSelected(order);
  }


  private removeOrderFromList(orderUID: string) {
    const newOrdersList = this.ordersList.filter(x => x.uid !== orderUID);
    this.setOrderData(newOrdersList);
    this.setOrderSelected(EmptyOrder());
  }

}
