/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { InventoryDataService } from '@app/data-services';

import { EmptyOrdersDataTable, EmptyOrdersQuery, OrdersDataTable, OrdersQuery, OrdersTypeConfig, OrderHolder,
         EmptyOrderHolder, OrdersQueryType } from '@app/models';

import { OrdersExplorerEventType } from '@app/views/orders/orders-explorer/orders-explorer.component';

import {
  InventoryOrdersFilterEventType
} from '../inventory-orders-filter/inventory-orders-filter.component';

import {
  InventoryOrderCreatorEventType
} from '@app/views/inventory/inventory-order/inventory-order-creator.component';

import {
  InventoryOrderTabbedViewEventType
} from '@app/views/inventory/inventory-order-tabbed-view/inventory-order-tabbed-view.component';

@Component({
  selector: 'emp-trade-inventory-orders-main-page',
  templateUrl: './inventory-orders-main-page.component.html',
})
export class InventoryOrdersMainPageComponent {

  config: OrdersTypeConfig = {
    type: OrdersQueryType.Inventory,
    titleText: 'Ordenes de inventario',
    itemText: 'orden',
    canAdd: false,
  };

  query: OrdersQuery = Object.assign({}, EmptyOrdersQuery);

  data: OrdersDataTable = Object.assign({}, EmptyOrdersDataTable);

  selectedData: OrderHolder = EmptyOrderHolder;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  displayTabbedView = false;

  displayCreator = false;


  constructor(private inventoryData: InventoryDataService) { }


  onOrderCreatorEvent(event: EventInfo) {
    switch (event.type as InventoryOrderCreatorEventType) {
      case InventoryOrderCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case InventoryOrderCreatorEventType.ORDER_CREATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.displayCreator = false;
        this.setSelectedData(event.payload.order as OrderHolder);
        this.validateQueryForRefreshOrders(this.selectedData.order.orderType.uid,
                                           this.selectedData.order.orderNo);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrdersFilterEvent(event: EventInfo) {
    switch (event.type as InventoryOrdersFilterEventType) {
      case InventoryOrdersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = Object.assign({}, this.query, event.payload.query as OrdersQuery);
        this.clearOrdersData();
        this.clearSelectedData();
        this.searchOrders(this.query);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrdersExplorerEvent(event: EventInfo) {
    switch (event.type as OrdersExplorerEventType) {
      case OrdersExplorerEventType.CREATE_ORDER:
        this.displayCreator = true;
        return;

      case OrdersExplorerEventType.SELECT_ORDER:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.getOrder(event.payload.entry.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as InventoryOrderTabbedViewEventType) {
      case InventoryOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.clearSelectedData();
        return;

      case InventoryOrderTabbedViewEventType.ORDER_UPDATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.refreshOrders();
        this.setSelectedData(event.payload.order as OrderHolder);
        return;

      case InventoryOrderTabbedViewEventType.ORDER_DELETED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.refreshOrders();
        this.clearSelectedData();
        return;

      case InventoryOrderTabbedViewEventType.ENTRIES_UPDATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.setSelectedData(event.payload.order as OrderHolder);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateQueryForRefreshOrders(orderTypeUID: string, keywords: string) {
    // if (this.query.orderTypeUID !== orderTypeUID) {
    //   const newQuery: OrdersQuery = {
    //     queryType: '',
    //     orderTypeUID: orderTypeUID,
    //     keywords,
    //     assignedToUID: '',
    //     status: ''
    //   };

    //   this.query = Object.assign({}, this.query, newQuery);
    // }

    this.refreshOrders();
  }


  private refreshOrders() {
    this.searchOrders(this.query);
  }


  private searchOrders(query: OrdersQuery) {
    this.isLoading = true;

    this.inventoryData.searchOrders(query)
      .firstValue()
      .then(x => this.setOrdersData(x, true))
      .finally(() => this.isLoading = false);
  }



  private getOrder(orderUID: string) {
    this.isLoadingSelection = true;

    this.inventoryData.getOrder(orderUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private setOrdersData(data: OrdersDataTable, queryExecuted: boolean = true) {
    this.data = data;
    this.queryExecuted = queryExecuted;
  }


  private clearOrdersData() {
    this.setOrdersData(EmptyOrdersDataTable, false);
  }


  private setSelectedData(data: OrderHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.order);
  }


  private clearSelectedData() {
    this.setSelectedData(EmptyOrderHolder);
  }

}
