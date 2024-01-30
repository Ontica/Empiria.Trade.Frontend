/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ApplicationStatusService, Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyOrder, Order, OrderDescriptor, OrderQueryType, OrderTypeConfig } from '@app/models';

import { OrdersFilterEventType } from './orders-filter.component';

import { OrdersControlsEventType } from './orders-controls.component';

import { OrdersTableEventType } from './orders-table.component';


export enum OrdersExplorerEventType {
  CREATE_ORDER      = 'OrdersExplorerComponent.Event.CreateOrder',
  SEARCH_ORDERS     = 'OrdersExplorerComponent.Event.SearchOrders',
  CLEAR_ORDERS      = 'OrdersExplorerComponent.Event.ClearOrders',
  SELECT_ORDER      = 'OrdersExplorerComponent.Event.SelectOrder',
  EXECUTE_OPERATION = 'OrdersExplorerComponent.Event.ExecuteOperation',
}

@Component({
  selector: 'emp-trade-orders-explorer',
  templateUrl: './orders-explorer.component.html',
})
export class OrdersExplorerComponent implements OnChanges {

  @Input() config: OrderTypeConfig = {
    type: OrderQueryType.Sales,
    titleText: 'Pedidos',
    itemText: 'pedido',
    canAdd: false,
  };

  @Input() ordersList: OrderDescriptor[] = [];

  @Input() orderSelected: Order = EmptyOrder();

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() ordersExplorerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  ordersSelected: string[] = [];


  constructor(private appStatus: ApplicationStatusService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.ordersList) {
      this.setText();
      this.resetOrderSelected();
    }
  }


  onCreateOrderClicked() {
    this.appStatus.canUserContinue()
      .subscribe(x =>
        x ? sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.CREATE_ORDER) : null
      );
  }


  onOrdersFilterEvent(event: EventInfo) {

    switch (event.type as OrdersFilterEventType) {

      case OrdersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.SEARCH_ORDERS, event.payload);
        return;

      case OrdersFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.CLEAR_ORDERS, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;

    }

  }


  onOrdersControlsEvent(event: EventInfo) {
    switch (event.type as OrdersControlsEventType) {

      case OrdersControlsEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.orders, 'event.payload.orders');

        sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.EXECUTE_OPERATION, event.payload);
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
        sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.SELECT_ORDER, event.payload);
        return;

      case OrdersTableEventType.SELECTION_CHANGED:
        Assertion.assertValue(event.payload.orders, 'event.payload.orders');
        this.ordersSelected = event.payload.orders;
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


  private resetOrderSelected() {
    this.ordersSelected = [];
  }

}
