/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { InventoryDataService } from '@app/data-services';

import { EmptyInventoryOrder, EmptyOrdersDataTable, EmptyInventoryOrdersQuery, InventoryOrder,
         OrdersDataTable, InventoryOrdersQuery, InventoryQueryType,
         OrdersTypeConfig } from '@app/models';

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

  salesConfig: OrdersTypeConfig = {
    type: InventoryQueryType.Inventory,
    titleText: 'Ordenes de inventario',
    itemText: 'orden',
    canAdd: true,
  };

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  query: InventoryOrdersQuery = EmptyInventoryOrdersQuery;

  inventoryOrdersData: OrdersDataTable = Object.assign({}, EmptyOrdersDataTable);

  inventoryOrderSelected: InventoryOrder = EmptyInventoryOrder;

  displayTabbedView = false;

  displayCreator = false;


  constructor(private inventoryData: InventoryDataService) { }


  onInventoryOrderCreatorEvent(event: EventInfo) {
    switch (event.type as InventoryOrderCreatorEventType) {
      case InventoryOrderCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;

      case InventoryOrderCreatorEventType.ORDER_CREATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.displayCreator = false;
        this.setInventoryOrderSelected(event.payload.order as InventoryOrder);
        this.validateQueryForRefreshInventoryOrders(this.inventoryOrderSelected.inventoryOrderType.uid,
                                                    this.inventoryOrderSelected.inventoryOrderNo);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrdersFilterEvent(event: EventInfo) {
    switch (event.type as InventoryOrdersFilterEventType) {
      case InventoryOrdersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = Object.assign({}, this.query, event.payload.query as InventoryOrdersQuery);
        this.clearInventoryOrdersData();
        this.clearInventoryOrderSelected();
        this.searchInventoryOrders(this.query);
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
        this.getInventoryOrder(event.payload.entry.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInventoryOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as InventoryOrderTabbedViewEventType) {
      case InventoryOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.clearInventoryOrderSelected();
        return;

      case InventoryOrderTabbedViewEventType.ORDER_UPDATED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.refreshInventoryOrders();
        this.setInventoryOrderSelected(event.payload.order as InventoryOrder);
        return;

      case InventoryOrderTabbedViewEventType.ORDER_DELETED:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        this.refreshInventoryOrders();
        this.clearInventoryOrderSelected();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateQueryForRefreshInventoryOrders(orderTypeUID: string, keywords: string) {
    if (this.query.inventoryOrderTypeUID !== orderTypeUID) {
      const newQuery: InventoryOrdersQuery = {
        queryType: '',
        inventoryOrderTypeUID: orderTypeUID,
        keywords,
        assignedToUID: '',
        status: ''
      };

      this.query = Object.assign({}, this.query, newQuery);
    }

    this.refreshInventoryOrders();
  }


  private refreshInventoryOrders() {
    this.searchInventoryOrders(this.query);
  }


  private searchInventoryOrders(query: InventoryOrdersQuery) {
    this.isLoading = true;

    this.inventoryData.searchOrders(query)
      .firstValue()
      .then(x => this.resolveSearchInventoryOrders(x))
      .finally(() => this.isLoading = false);
  }



  private getInventoryOrder(orderUID: string) {
    this.isLoadingSelection = true;

    this.inventoryData.getOrder(orderUID)
      .firstValue()
      .then(x => this.setInventoryOrderSelected(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveSearchInventoryOrders(data: OrdersDataTable) {
    this.setInventoryOrdersData(data, true);
  }


  private setInventoryOrdersData(data: OrdersDataTable, queryExecuted: boolean = true) {
    this.inventoryOrdersData = data;
    this.queryExecuted = queryExecuted;
  }


  private clearInventoryOrdersData() {
    this.setInventoryOrdersData(EmptyOrdersDataTable, false);
  }


  private setInventoryOrderSelected(data: InventoryOrder) {
    this.inventoryOrderSelected = data;
    this.displayTabbedView = !isEmpty(this.inventoryOrderSelected);
  }


  private clearInventoryOrderSelected() {
    this.setInventoryOrderSelected(EmptyInventoryOrder);
  }

}
