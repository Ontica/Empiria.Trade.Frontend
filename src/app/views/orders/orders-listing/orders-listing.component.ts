/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptyOrder, Order, OrderQueryType } from '@app/models';

import { OrdersFilterEventType } from './orders-filter.component';

import { sendEvent } from '@app/shared/utils';

import { OrdersTableEventType } from './orders-table.component';


export enum OrdersListingEventType {
  CREATE_ORDER  = 'OrdersListingComponent.Event.CreateOrder',
  SEARCH_ORDERS = 'OrdersListingComponent.Event.SearchOrders',
  SELECT_ORDER  = 'OrdersListingComponent.Event.SelectOrder',
}


export interface OrderTypeConfig {
  type: OrderQueryType;
  text: string;
  addText: string;
  canAdd: boolean;
}

@Component({
  selector: 'emp-trade-orders-listing',
  templateUrl: './orders-listing.component.html',
})
export class OrdersListingComponent implements OnChanges {

  @Input() config: OrderTypeConfig = {
    type: OrderQueryType.Sales,
    text: 'Pedido',
    addText: 'pedido',
    canAdd: false,
  };

  @Input() ordersList: Order[] = [];

  @Input() orderSelected: Order = EmptyOrder();

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() ordersListingEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.ordersList) {
      this.setText();
    }
  }


  onCreateOrderClicked() {
    sendEvent(this.ordersListingEvent, OrdersListingEventType.CREATE_ORDER);
  }


  onOrdersFilterEvent(event: EventInfo) {

    switch (event.type as OrdersFilterEventType) {

      case OrdersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.ordersListingEvent, OrdersListingEventType.SEARCH_ORDERS, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;

    }

  }


  onOrdersListEvent(event: EventInfo) {

    switch (event.type as OrdersTableEventType) {

      case OrdersTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.ordersListingEvent, OrdersListingEventType.SELECT_ORDER, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;

    }

  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.ordersList.length} registros encontrados`;
  }

}
